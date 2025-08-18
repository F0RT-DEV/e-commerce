import db from '../../db.js';

export class CouponModel {
  
  // Criar novo cupom (admin)
  static async create(couponData) {
    try {
      const [id] = await db('cupons').insert({
        codigo: couponData.codigo.toUpperCase(),
        tipo: couponData.tipo,
        valor: couponData.valor,
        validade: couponData.validade,
        uso_maximo: couponData.uso_maximo || 1,
        usado: 0,
        ativo: couponData.ativo !== undefined ? couponData.ativo : true
      });
      
      return await this.findById(id);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Código do cupom já existe');
      }
      throw error;
    }
  }

  // Buscar cupom por ID
  static async findById(id) {
    const cupom = await db('cupons')
      .where({ id })
      .first();
    
    if (!cupom) {
      return null;
    }

    return {
      ...cupom,
      disponivel: cupom.usado < cupom.uso_maximo && cupom.ativo && new Date(cupom.validade) >= new Date()
    };
  }

  // Buscar cupom por código
  static async findByCode(codigo) {
    const cupom = await db('cupons')
      .where({ codigo: codigo.toUpperCase() })
      .first();
    
    if (!cupom) {
      return null;
    }

    return {
      ...cupom,
      disponivel: cupom.usado < cupom.uso_maximo && cupom.ativo && new Date(cupom.validade) >= new Date()
    };
  }

  // Listar cupons com filtros (admin)
  static async findAll(filters = {}) {
    const {
      page = 1,
      limit = 10,
      tipo,
      ativo,
      search,
      sort = 'created_at',
      order = 'desc'
    } = filters;

    const offset = (page - 1) * limit;
    
    let query = db('cupons');

    // Aplicar filtros
    if (tipo) {
      query = query.where('tipo', tipo);
    }

    if (ativo !== undefined) {
      query = query.where('ativo', ativo);
    }

    if (search) {
      query = query.where(function() {
        this.where('codigo', 'like', `%${search}%`);
      });
    }

    // Contar total de registros
    const countQuery = query.clone();
    const [{ total }] = await countQuery.count('* as total');

    // Aplicar ordenação e paginação
    const cupons = await query
      .orderBy(sort, order)
      .limit(limit)
      .offset(offset);

    // Adicionar campo disponivel
    const cuponsComStatus = cupons.map(cupom => ({
      ...cupom,
      disponivel: cupom.usado < cupom.uso_maximo && cupom.ativo && new Date(cupom.validade) >= new Date()
    }));

    return {
      cupons: cuponsComStatus,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(total),
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Atualizar cupom (admin)
  static async update(id, updateData) {
    try {
      const cupom = await this.findById(id);
      if (!cupom) {
        return null;
      }

      // Preparar dados para atualização
      const dataToUpdate = { ...updateData };
      if (dataToUpdate.codigo) {
        dataToUpdate.codigo = dataToUpdate.codigo.toUpperCase();
      }

      await db('cupons')
        .where({ id })
        .update(dataToUpdate);

      return await this.findById(id);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Código do cupom já existe');
      }
      throw error;
    }
  }

  // Deletar cupom (admin)
  static async delete(id) {
    const cupom = await this.findById(id);
    if (!cupom) {
      return false;
    }

    await db('cupons')
      .where({ id })
      .del();

    return true;
  }

  // Verificar se cupom é válido para uso
  static async validateCoupon(codigo, userId = null) {
    const cupom = await this.findByCode(codigo);
    
    if (!cupom) {
      return {
        valid: false,
        message: 'Cupom não encontrado'
      };
    }

    if (!cupom.ativo) {
      return {
        valid: false,
        message: 'Cupom está inativo'
      };
    }

    if (new Date(cupom.validade) < new Date()) {
      return {
        valid: false,
        message: 'Cupom expirado'
      };
    }

    if (cupom.usado >= cupom.uso_maximo) {
      return {
        valid: false,
        message: 'Cupom esgotado'
      };
    }

    // Verificar se usuário já usou este cupom (se userId fornecido)
    if (userId) {
      const jaUsou = await db('cupons_usuarios')
        .where({
          cupom_id: cupom.id,
          usuario_id: userId
        })
        .first();

      if (jaUsou) {
        return {
          valid: false,
          message: 'Você já utilizou este cupom'
        };
      }
    }

    return {
      valid: true,
      cupom,
      message: 'Cupom válido'
    };
  }

  // Aplicar cupom (registrar uso)
  static async applyCoupon(cupomId, userId, pedidoId = null) {
    const trx = await db.transaction();
    
    try {
      // Verificar se cupom ainda está disponível
      const cupom = await trx('cupons')
        .where({ id: cupomId })
        .forUpdate()
        .first();

      if (!cupom || cupom.usado >= cupom.uso_maximo) {
        await trx.rollback();
        return {
          success: false,
          message: 'Cupom não está mais disponível'
        };
      }

      // Registrar uso do cupom
      await trx('cupons_usuarios').insert({
        cupom_id: cupomId,
        usuario_id: userId,
        usado_em: new Date()
      });

      // Incrementar contador de uso
      await trx('cupons')
        .where({ id: cupomId })
        .increment('usado', 1);

      await trx.commit();

      return {
        success: true,
        message: 'Cupom aplicado com sucesso'
      };

    } catch (error) {
      await trx.rollback();
      
      if (error.code === 'ER_DUP_ENTRY') {
        return {
          success: false,
          message: 'Você já utilizou este cupom'
        };
      }
      
      throw error;
    }
  }

  // Calcular desconto
  static calculateDiscount(cupom, totalCarrinho) {
    if (cupom.tipo === 'percentual') {
      return Math.round((totalCarrinho * cupom.valor / 100) * 100) / 100;
    } else {
      return Math.min(cupom.valor, totalCarrinho);
    }
  }

  // Estatísticas de cupons (admin)
  static async getStats() {
    const [stats] = await db('cupons')
      .select([
        db.raw('COUNT(*) as total'),
        db.raw('COUNT(CASE WHEN ativo = 1 THEN 1 END) as ativos'),
        db.raw('COUNT(CASE WHEN ativo = 0 THEN 1 END) as inativos'),
        db.raw('COUNT(CASE WHEN validade < NOW() THEN 1 END) as expirados'),
        db.raw('COUNT(CASE WHEN usado >= uso_maximo THEN 1 END) as esgotados'),
        db.raw('SUM(usado) as total_usos')
      ]);

    const cuponsPopulares = await db('cupons')
      .select(['codigo', 'usado', 'uso_maximo'])
      .where('usado', '>', 0)
      .orderBy('usado', 'desc')
      .limit(5);

    return {
      ...stats,
      cupons_populares: cuponsPopulares
    };
  }

  // Listar cupons ativos (público)
  static async findActiveCoupons() {
    return await db('cupons')
      .select(['codigo', 'tipo', 'valor', 'validade'])
      .where('ativo', true)
      .where('validade', '>=', new Date())
      .whereRaw('usado < uso_maximo')
      .orderBy('created_at', 'desc');
  }
}
