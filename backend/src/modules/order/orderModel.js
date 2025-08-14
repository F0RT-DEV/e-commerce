import db from '../../db.js';

// 📋 Listar pedidos do cliente
export const getOrdersByUser = async (usuario_id, filters = {}) => {
  try {
    const { status, page = 1, limit = 10, data_inicio, data_fim } = filters;
    const offset = (page - 1) * limit;

    let query = db('pedidos')
      .select(
        'id',
        'usuario_id',
        'subtotal',
        'valor_desconto',
        'valor_frete', 
        'total',
        'status',
        'metodo_pagamento',
        'codigo_cupom',
        'endereco_cep',
        'endereco_rua',
        'endereco_numero',
        'endereco_complemento',
        'endereco_bairro',
        'endereco_cidade',
        'endereco_estado',
        'observacoes',
        'criado_em'
      )
      .where({ usuario_id })
      .orderBy('criado_em', 'desc');

    // Filtros opcionais
    if (status) {
      query = query.where('status', status);
    }

    if (data_inicio && data_fim) {
      query = query.whereBetween('criado_em', [data_inicio, data_fim]);
    }

    // Paginação
    const total = await query.clone().count('id as total').first();
    const pedidos = await query.limit(limit).offset(offset);

    // Buscar itens de cada pedido
    for (const pedido of pedidos) {
      const itens = await db('pedido_itens as pi')
        .join('produtos as p', 'pi.produto_id', 'p.id')
        .select(
          'pi.id',
          'pi.produto_id',
          'pi.quantidade',
          'pi.preco_unitario',
          'p.nome',
          'p.imagem'
        )
        .where('pi.pedido_id', pedido.id);

      pedido.itens = itens;
      pedido.total_itens = itens.reduce((sum, item) => sum + item.quantidade, 0);
    }

    return {
      pedidos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(total.total),
        pages: Math.ceil(total.total / limit)
      }
    };

  } catch (error) {
    throw new Error(`Erro ao buscar pedidos: ${error.message}`);
  }
};

// 🔍 Buscar pedido específico do cliente
export const getOrderById = async (pedido_id, usuario_id) => {
  try {
    const pedido = await db('pedidos')
      .select('*')
      .where({ id: pedido_id, usuario_id })
      .first();

    if (!pedido) {
      throw new Error('Pedido não encontrado');
    }

    // Buscar itens do pedido
    const itens = await db('pedido_itens as pi')
      .join('produtos as p', 'pi.produto_id', 'p.id')
      .select(
        'pi.id',
        'pi.produto_id', 
        'pi.quantidade',
        'pi.preco_unitario',
        'p.nome',
        'p.descricao',
        'p.imagem',
        db.raw('(pi.quantidade * pi.preco_unitario) as subtotal')
      )
      .where('pi.pedido_id', pedido_id);

    pedido.itens = itens;
    pedido.total_itens = itens.reduce((sum, item) => sum + item.quantidade, 0);

    return pedido;

  } catch (error) {
    throw new Error(`Erro ao buscar pedido: ${error.message}`);
  }
};

// 🔄 Atualizar status do pedido (Admin)
export const updateOrderStatus = async (pedido_id, status, observacoes_admin = null) => {
  try {
    const pedido = await db('pedidos').where({ id: pedido_id }).first();
    
    if (!pedido) {
      throw new Error('Pedido não encontrado');
    }

    const updateData = {
      status,
      atualizado_em: new Date()
    };

    if (observacoes_admin) {
      // Vamos adicionar campo observacoes_admin na próxima migration se necessário
      updateData.observacoes = observacoes_admin;
    }

    await db('pedidos')
      .where({ id: pedido_id })
      .update(updateData);

    return await db('pedidos').where({ id: pedido_id }).first();

  } catch (error) {
    throw new Error(`Erro ao atualizar status: ${error.message}`);
  }
};

// 📊 Buscar todos os pedidos (Admin)
export const getAllOrders = async (filters = {}) => {
  try {
    const { 
      status, 
      page = 1, 
      limit = 20, 
      data_inicio, 
      data_fim,
      termo,
      usuario_id,
      metodo_pagamento 
    } = filters;
    
    const offset = (page - 1) * limit;

    let query = db('pedidos as p')
      .join('usuarios as u', 'p.usuario_id', 'u.id')
      .select(
        'p.id',
        'p.usuario_id',
        'u.nome as usuario_nome',
        'u.email as usuario_email',
        'p.subtotal',
        'p.valor_desconto',
        'p.valor_frete',
        'p.total',
        'p.status',
        'p.metodo_pagamento',
        'p.codigo_cupom',
        'p.endereco_cidade',
        'p.endereco_estado',
        'p.criado_em'
      )
      .orderBy('p.criado_em', 'desc');

    // Filtros
    if (status) {
      query = query.where('p.status', status);
    }

    if (usuario_id) {
      query = query.where('p.usuario_id', usuario_id);
    }

    if (metodo_pagamento) {
      query = query.where('p.metodo_pagamento', metodo_pagamento);
    }

    if (data_inicio && data_fim) {
      query = query.whereBetween('p.criado_em', [data_inicio, data_fim]);
    }

    if (termo) {
      query = query.where(function() {
        this.where('u.nome', 'like', `%${termo}%`)
            .orWhere('u.email', 'like', `%${termo}%`)
            .orWhere('p.id', 'like', `%${termo}%`);
      });
    }

    // Paginação
    const total = await query.clone().count('p.id as total').first();
    const pedidos = await query.limit(limit).offset(offset);

    return {
      pedidos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(total.total),
        pages: Math.ceil(total.total / limit)
      }
    };

  } catch (error) {
    throw new Error(`Erro ao buscar pedidos: ${error.message}`);
  }
};

// 📈 Estatísticas de pedidos (Admin)
export const getOrderStats = async (filters = {}) => {
  try {
    const { periodo = 'mes', data_inicio, data_fim, status } = filters;

    // Configurar intervalo de datas baseado no período
    let startDate, endDate;
    if (data_inicio && data_fim) {
      startDate = data_inicio;
      endDate = data_fim;
    } else {
      const now = new Date();
      switch (periodo) {
        case 'dia':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          endDate = new Date(now.setHours(23, 59, 59, 999));
          break;
        case 'semana':
          startDate = new Date(now.setDate(now.getDate() - 7));
          endDate = new Date();
          break;
        case 'mes':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          break;
        case 'ano':
          startDate = new Date(now.getFullYear(), 0, 1);
          endDate = new Date(now.getFullYear(), 11, 31);
          break;
      }
    }

    let query = db('pedidos').whereBetween('criado_em', [startDate, endDate]);

    if (status) {
      query = query.where('status', status);
    }

    // Estatísticas básicas
    const stats = await query.clone()
      .select(
        db.raw('COUNT(*) as total_pedidos'),
        db.raw('SUM(total) as receita_total'),
        db.raw('AVG(total) as ticket_medio'),
        db.raw('SUM(valor_frete) as total_frete'),
        db.raw('SUM(valor_desconto) as total_descontos')
      )
      .first();

    // Pedidos por status
    const pedidosPorStatus = await db('pedidos')
      .whereBetween('criado_em', [startDate, endDate])
      .select('status')
      .count('id as total')
      .groupBy('status');

    // Pedidos por método de pagamento
    const pedidosPorPagamento = await db('pedidos')
      .whereBetween('criado_em', [startDate, endDate])
      .select('metodo_pagamento')
      .count('id as total')
      .sum('total as receita')
      .groupBy('metodo_pagamento');

    return {
      periodo: {
        inicio: startDate,
        fim: endDate,
        tipo: periodo
      },
      estatisticas: {
        total_pedidos: parseInt(stats.total_pedidos) || 0,
        receita_total: parseFloat(stats.receita_total) || 0,
        ticket_medio: parseFloat(stats.ticket_medio) || 0,
        total_frete: parseFloat(stats.total_frete) || 0,
        total_descontos: parseFloat(stats.total_descontos) || 0
      },
      distribuicao: {
        por_status: pedidosPorStatus,
        por_pagamento: pedidosPorPagamento
      }
    };

  } catch (error) {
    throw new Error(`Erro ao gerar estatísticas: ${error.message}`);
  }
};
