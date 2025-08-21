import db from '../../db.js';

export class ReviewModel {
  // ⭐ Criar uma nova avaliação
  static async create(reviewData) {
    try {
      const { produto_id, usuario_id, nota, comentario } = reviewData;

      // Verificar se o usuário já avaliou este produto
      const existingReview = await this.findByProductAndUser(produto_id, usuario_id);
      if (existingReview) {
        throw new Error('Você já avaliou este produto');
      }

      const [id] = await db('avaliacoes').insert({
        produto_id,
        usuario_id,
        nota,
        comentario,
        criado_em: new Date()
      });

      console.log(`⭐ Avaliação criada: ${nota} estrelas para produto ${produto_id} por usuário ${usuario_id}`);

      return await this.findById(id);
    } catch (error) {
      console.error('❌ Erro ao criar avaliação:', error);
      throw error;
    }
  }

  // 🔍 Buscar avaliação por ID
  static async findById(id) {
    try {
      const review = await db('avaliacoes')
        .select(
          'avaliacoes.*',
          'usuarios.nome as usuario_nome',
          'produtos.nome as produto_nome'
        )
        .leftJoin('usuarios', 'avaliacoes.usuario_id', 'usuarios.id')
        .leftJoin('produtos', 'avaliacoes.produto_id', 'produtos.id')
        .where('avaliacoes.id', id)
        .first();

      return review || null;
    } catch (error) {
      console.error('❌ Erro ao buscar avaliação:', error);
      throw new Error('Erro ao buscar avaliação');
    }
  }

  // 🔍 Buscar avaliação por produto e usuário
  static async findByProductAndUser(produto_id, usuario_id) {
    try {
      const review = await db('avaliacoes')
        .where({ produto_id, usuario_id })
        .first();

      return review || null;
    } catch (error) {
      console.error('❌ Erro ao buscar avaliação do usuário:', error);
      throw new Error('Erro ao buscar avaliação');
    }
  }

  // 📋 Listar avaliações de um produto
  static async findByProduct(produto_id, options = {}) {
    try {
      const { page = 1, limit = 10, nota, order = 'desc' } = options;
      const offset = (page - 1) * limit;

      let query = db('avaliacoes')
        .select(
          'avaliacoes.*',
          'usuarios.nome as usuario_nome'
        )
        .leftJoin('usuarios', 'avaliacoes.usuario_id', 'usuarios.id')
        .where('avaliacoes.produto_id', produto_id);

      // Filtro por nota
      if (nota) {
        query = query.andWhere('avaliacoes.nota', nota);
      }

      // Ordenação
      query = query.orderBy('avaliacoes.criado_em', order);

      // Paginação
      const reviews = await query.limit(limit).offset(offset);

      // Contar total
      let countQuery = db('avaliacoes').where('produto_id', produto_id);
      if (nota) {
        countQuery = countQuery.andWhere('nota', nota);
      }
      const [{ total }] = await countQuery.count('* as total');

      return {
        reviews,
        pagination: {
          current_page: page,
          per_page: limit,
          total: total,
          total_pages: Math.ceil(total / limit),
          has_next: page < Math.ceil(total / limit),
          has_prev: page > 1
        }
      };
    } catch (error) {
      console.error('❌ Erro ao listar avaliações:', error);
      throw new Error('Erro ao listar avaliações');
    }
  }

  // 📊 Estatísticas de avaliações de um produto
  static async getProductStats(produto_id) {
    try {
      // Contagem por nota
      const ratingCounts = await db('avaliacoes')
        .select('nota')
        .count('* as count')
        .where('produto_id', produto_id)
        .groupBy('nota')
        .orderBy('nota', 'desc');

      // Estatísticas gerais
      const stats = await db('avaliacoes')
        .where('produto_id', produto_id)
        .select(
          db.raw('COUNT(*) as total_avaliacoes'),
          db.raw('AVG(nota) as nota_media'),
          db.raw('MAX(nota) as maior_nota'),
          db.raw('MIN(nota) as menor_nota')
        )
        .first();

      // Formatar contagem por estrelas
      const ratingDistribution = {
        5: 0, 4: 0, 3: 0, 2: 0, 1: 0
      };

      ratingCounts.forEach(item => {
        ratingDistribution[item.nota] = parseInt(item.count);
      });

      return {
        total_avaliacoes: parseInt(stats.total_avaliacoes),
        nota_media: parseFloat(stats.nota_media) || 0,
        maior_nota: parseInt(stats.maior_nota) || 0,
        menor_nota: parseInt(stats.menor_nota) || 0,
        distribuicao_notas: ratingDistribution
      };
    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      throw new Error('Erro ao buscar estatísticas de avaliações');
    }
  }

  // 📋 Listar avaliações de um usuário
  static async findByUser(usuario_id, options = {}) {
    try {
      const { page = 1, limit = 10, order = 'desc' } = options;
      const offset = (page - 1) * limit;

      const reviews = await db('avaliacoes')
        .select(
          'avaliacoes.*',
          'produtos.nome as produto_nome',
          'produtos.imagem as produto_imagem'
        )
        .leftJoin('produtos', 'avaliacoes.produto_id', 'produtos.id')
        .where('avaliacoes.usuario_id', usuario_id)
        .orderBy('avaliacoes.criado_em', order)
        .limit(limit)
        .offset(offset);

      // Contar total
      const [{ total }] = await db('avaliacoes')
        .where('usuario_id', usuario_id)
        .count('* as total');

      return {
        reviews,
        pagination: {
          current_page: page,
          per_page: limit,
          total: total,
          total_pages: Math.ceil(total / limit),
          has_next: page < Math.ceil(total / limit),
          has_prev: page > 1
        }
      };
    } catch (error) {
      console.error('❌ Erro ao listar avaliações do usuário:', error);
      throw new Error('Erro ao listar avaliações do usuário');
    }
  }

  // ✏️ Atualizar uma avaliação
  static async update(id, usuario_id, updateData) {
    try {
      // Verificar se a avaliação existe e pertence ao usuário
      const review = await db('avaliacoes')
        .where({ id, usuario_id })
        .first();

      if (!review) {
        throw new Error('Avaliação não encontrada ou não pertence ao usuário');
      }

      await db('avaliacoes')
        .where({ id, usuario_id })
        .update({
          ...updateData,
          atualizado_em: new Date()
        });

      console.log(`✏️ Avaliação ${id} atualizada pelo usuário ${usuario_id}`);

      return await this.findById(id);
    } catch (error) {
      if (error.message === 'Avaliação não encontrada ou não pertence ao usuário') {
        throw error;
      }
      console.error('❌ Erro ao atualizar avaliação:', error);
      throw new Error('Erro ao atualizar avaliação');
    }
  }

  // 🗑️ Deletar uma avaliação
  static async delete(id, usuario_id) {
    try {
      // Verificar se a avaliação existe e pertence ao usuário
      const review = await db('avaliacoes')
        .where({ id, usuario_id })
        .first();

      if (!review) {
        throw new Error('Avaliação não encontrada ou não pertence ao usuário');
      }

      await db('avaliacoes')
        .where({ id, usuario_id })
        .del();

      console.log(`🗑️ Avaliação ${id} deletada pelo usuário ${usuario_id}`);

      return { message: 'Avaliação deletada com sucesso' };
    } catch (error) {
      if (error.message === 'Avaliação não encontrada ou não pertence ao usuário') {
        throw error;
      }
      console.error('❌ Erro ao deletar avaliação:', error);
      throw new Error('Erro ao deletar avaliação');
    }
  }

  // 🛒 Verificar se o usuário comprou o produto
  static async hasUserPurchasedProduct(usuario_id, produto_id) {
    try {
      const purchase = await db('pedidos')
        .join('pedido_itens', 'pedidos.id', 'pedido_itens.pedido_id')
        .where({
          'pedidos.usuario_id': usuario_id,
          'pedido_itens.produto_id': produto_id
        })
        .whereIn('pedidos.status', ['enviado', 'entregue']) // Pode avaliar após envio ou entrega
        .first();

      return !!purchase;
    } catch (error) {
      console.error('❌ Erro ao verificar compra:', error);
      throw new Error('Erro ao verificar compra do produto');
    }
  }
}