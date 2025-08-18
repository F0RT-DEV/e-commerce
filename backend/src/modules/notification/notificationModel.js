import db from '../../db.js';

export class NotificationModel {

  // 📩 Criar uma notificação
  static async create(notificationData) {
    try {
      const [id] = await db('notificacoes').insert({
        usuario_id: notificationData.usuario_id,
        titulo: notificationData.titulo,
        mensagem: notificationData.mensagem,
        lida: false,
        criado_em: new Date()
      });

      const notification = await this.findById(id);
      console.log(`📩 Notificação criada: ${notification.titulo} para usuário ${notification.usuario_id}`);
      
      return notification;
    } catch (error) {
      console.error('❌ Erro ao criar notificação:', error);
      throw new Error('Erro ao criar notificação');
    }
  }

  // 📋 Buscar notificação por ID
  static async findById(id) {
    try {
      const notification = await db('notificacoes')
        .select('*')
        .where({ id })
        .first();

      if (!notification) {
        throw new Error('Notificação não encontrada');
      }

      return notification;
    } catch (error) {
      if (error.message === 'Notificação não encontrada') {
        throw error;
      }
      console.error('❌ Erro ao buscar notificação:', error);
      throw new Error('Erro ao buscar notificação');
    }
  }

  // 📜 Listar notificações do usuário
  static async findByUser(userId, options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        lida = null,
        order = 'desc'
      } = options;

      const offset = (page - 1) * limit;

      let query = db('notificacoes')
        .select('*')
        .where({ usuario_id: userId });

      // Filtrar por status de leitura se especificado
      if (lida !== null) {
        query = query.where({ lida });
      }

      // Ordenar por data de criação
      query = query.orderBy('criado_em', order);

      // Paginação
      const notifications = await query.limit(limit).offset(offset);

      // Contar total para paginação
      let countQuery = db('notificacoes')
        .count('* as total')
        .where({ usuario_id: userId });

      if (lida !== null) {
        countQuery = countQuery.where({ lida });
      }

      const [{ total }] = await countQuery;

      // Calcular estatísticas
      const stats = await this.getUserStats(userId);

      return {
        notifications,
        pagination: {
          current_page: page,
          per_page: limit,
          total: parseInt(total),
          total_pages: Math.ceil(total / limit),
          has_next: page < Math.ceil(total / limit),
          has_prev: page > 1
        },
        stats
      };
    } catch (error) {
      console.error('❌ Erro ao listar notificações:', error);
      throw new Error('Erro ao listar notificações');
    }
  }

  // 📊 Estatísticas do usuário
  static async getUserStats(userId) {
    try {
      const [stats] = await db('notificacoes')
        .select(
          db.raw('COUNT(*) as total'),
          db.raw('SUM(CASE WHEN lida = 1 THEN 1 ELSE 0 END) as lidas'),
          db.raw('SUM(CASE WHEN lida = 0 THEN 1 ELSE 0 END) as nao_lidas')
        )
        .where({ usuario_id: userId });

      return {
        total: parseInt(stats.total) || 0,
        lidas: parseInt(stats.lidas) || 0,
        nao_lidas: parseInt(stats.nao_lidas) || 0
      };
    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      throw new Error('Erro ao buscar estatísticas');
    }
  }

  // ✅ Marcar notificação como lida
  static async markAsRead(id, userId) {
    try {
      // Verificar se a notificação existe e pertence ao usuário
      const notification = await db('notificacoes')
        .select('*')
        .where({ id, usuario_id: userId })
        .first();

      if (!notification) {
        throw new Error('Notificação não encontrada');
      }

      if (notification.lida) {
        throw new Error('Notificação já foi lida');
      }

      // Marcar como lida
      await db('notificacoes')
        .where({ id, usuario_id: userId })
        .update({ lida: true });

      console.log(`✅ Notificação ${id} marcada como lida para usuário ${userId}`);

      return await this.findById(id);
    } catch (error) {
      if (error.message === 'Notificação não encontrada' || error.message === 'Notificação já foi lida') {
        throw error;
      }
      console.error('❌ Erro ao marcar notificação como lida:', error);
      throw new Error('Erro ao marcar notificação como lida');
    }
  }

  // ✅ Marcar todas as notificações como lidas
  static async markAllAsRead(userId) {
    try {
      const updated = await db('notificacoes')
        .where({ usuario_id: userId, lida: false })
        .update({ lida: true });

      console.log(`✅ ${updated} notificações marcadas como lidas para usuário ${userId}`);

      return { count: updated };
    } catch (error) {
      console.error('❌ Erro ao marcar todas como lidas:', error);
      throw new Error('Erro ao marcar todas as notificações como lidas');
    }
  }

  // 🗑️ Deletar notificação
  static async delete(id, userId = null) {
    try {
      const query = db('notificacoes').where({ id });
      
      // Se userId fornecido, verificar propriedade
      if (userId) {
        query.andWhere({ usuario_id: userId });
      }

      const notification = await query.clone().first();

      if (!notification) {
        throw new Error('Notificação não encontrada');
      }

      await query.del();

      console.log(`🗑️ Notificação ${id} deletada${userId ? ` para usuário ${userId}` : ' (admin)'}`);

      return { message: 'Notificação deletada com sucesso' };
    } catch (error) {
      if (error.message === 'Notificação não encontrada') {
        throw error;
      }
      console.error('❌ Erro ao deletar notificação:', error);
      throw new Error('Erro ao deletar notificação');
    }
  }

  // 📝 Atualizar notificação (admin)
  static async update(id, updateData) {
    try {
      const notification = await this.findById(id);
      
      if (!notification) {
        throw new Error('Notificação não encontrada');
      }

      await db('notificacoes')
        .where({ id })
        .update({
          ...updateData,
          atualizado_em: new Date()
        });

      console.log(`📝 Notificação ${id} atualizada`);

      return await this.findById(id);
    } catch (error) {
      if (error.message === 'Notificação não encontrada') {
        throw error;
      }
      console.error('❌ Erro ao atualizar notificação:', error);
      throw new Error('Erro ao atualizar notificação');
    }
  }

  // � Listar todas as notificações (admin)
  static async findAll(options = {}) {
    try {
      const { page = 1, limit = 20, lida, order = 'desc' } = options;
      const offset = (page - 1) * limit;

      let query = db('notificacoes')
        .select(
          'notificacoes.*',
          'usuarios.nome as usuario_nome',
          'usuarios.email as usuario_email'
        )
        .leftJoin('usuarios', 'notificacoes.usuario_id', 'usuarios.id');

      // Filtrar por status de leitura
      if (typeof lida === 'boolean') {
        query.where('notificacoes.lida', lida);
      }

      // Ordenação
      query.orderBy('notificacoes.criado_em', order);

      // Buscar notificações
      const notifications = await query
        .limit(limit)
        .offset(offset);

      // Contar total
      const totalQuery = db('notificacoes');
      if (typeof lida === 'boolean') {
        totalQuery.where('lida', lida);
      }
      const [{ total }] = await totalQuery.count('id as total');

      // Estatísticas
      const stats = await this.getGlobalStats();

      return {
        notifications,
        pagination: {
          current_page: page,
          per_page: limit,
          total: parseInt(total),
          total_pages: Math.ceil(total / limit),
          has_next: page * limit < total,
          has_prev: page > 1
        },
        stats
      };
    } catch (error) {
      console.error('❌ Erro ao buscar todas as notificações:', error);
      throw new Error('Erro ao buscar notificações');
    }
  }

  // 📊 Estatísticas globais (admin)
  static async getGlobalStats() {
    try {
      // Contadores gerais
      const [totalResult] = await db('notificacoes').count('id as total');
      const [lidasResult] = await db('notificacoes').where('lida', true).count('id as total');
      const [naoLidasResult] = await db('notificacoes').where('lida', false).count('id as total');

      // Estatísticas por tipo
      const tipoStats = await db('notificacoes')
        .select('tipo')
        .count('id as total')
        .groupBy('tipo');

      // Usuários com mais notificações
      const topUsers = await db('notificacoes')
        .select(
          'usuarios.nome',
          'usuarios.email'
        )
        .count('notificacoes.id as total_notificacoes')
        .leftJoin('usuarios', 'notificacoes.usuario_id', 'usuarios.id')
        .groupBy('notificacoes.usuario_id', 'usuarios.nome', 'usuarios.email')
        .orderBy('total_notificacoes', 'desc')
        .limit(5);

      return {
        total: parseInt(totalResult.total),
        lidas: parseInt(lidasResult.total),
        nao_lidas: parseInt(naoLidasResult.total),
        por_tipo: tipoStats,
        usuarios_mais_ativos: topUsers
      };
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas globais:', error);
      throw new Error('Erro ao obter estatísticas');
    }
  }

  // 📨 Funções específicas para criação de notificações de pedido

  // 🆕 Criar notificação de novo pedido
  static async createOrderNotification(userId, pedidoId, total) {
    const titulo = 'Pedido Confirmado! 🎉';
    const mensagem = `Seu pedido #${pedidoId} foi confirmado com sucesso! Total: R$ ${total.toFixed(2)}. Você receberá atualizações sobre o status do seu pedido.`;
    
    return await this.create({
      usuario_id: userId,
      titulo,
      mensagem
    });
  }

  // 📦 Criar notificação de mudança de status
  static async createStatusChangeNotification(userId, pedidoId, statusAntigo, statusNovo) {
    const statusMessages = {
      'pendente': '⏳ Aguardando processamento',
      'confirmado': '✅ Confirmado e sendo preparado',
      'preparando': '📦 Sendo preparado para envio',
      'enviado': '🚛 Enviado para entrega',
      'entregue': '✅ Entregue com sucesso',
      'cancelado': '❌ Cancelado'
    };

    const titulo = `Status do Pedido Atualizado`;
    const mensagem = `Seu pedido #${pedidoId} teve o status alterado de "${statusMessages[statusAntigo] || statusAntigo}" para "${statusMessages[statusNovo] || statusNovo}".`;
    
    return await this.create({
      usuario_id: userId,
      titulo,
      mensagem
    });
  }

  // 🎟️ Criar notificação de cupom usado
  static async createCouponUsedNotification(userId, cupomCodigo, desconto) {
    const titulo = '🎟️ Cupom Aplicado!';
    const mensagem = `Cupom "${cupomCodigo}" aplicado com sucesso! Você economizou R$ ${desconto.toFixed(2)} na sua compra.`;
    
    return await this.create({
      usuario_id: userId,
      titulo,
      mensagem
    });
  }
}
