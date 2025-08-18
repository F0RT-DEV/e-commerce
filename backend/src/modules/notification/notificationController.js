import { NotificationModel } from './notificationModel.js';
import {
  createNotificationSchema,
  updateNotificationSchema,
  listNotificationsSchema,
  markAsReadSchema,
  getNotificationSchema
} from './notificationSchema.js';

export class NotificationController {

  // 📜 Listar notificações do usuário
  static async getUserNotifications(req, res) {
    try {
      const { error, value } = listNotificationsSchema.validate(req.query);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Parâmetros inválidos',
          errors: error.details.map(detail => detail.message)
        });
      }

      const userId = req.user.id;
      const result = await NotificationModel.findByUser(userId, value);

      res.json({
        success: true,
        message: 'Notificações listadas com sucesso',
        data: {
          notifications: result.notifications,
          pagination: result.pagination,
          stats: result.stats
        }
      });

    } catch (error) {
      console.error('Erro ao listar notificações:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // 👁️ Obter notificação específica
  static async getNotification(req, res) {
    try {
      const { error, value } = getNotificationSchema.validate({ id: parseInt(req.params.id) });
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'ID inválido',
          errors: error.details.map(detail => detail.message)
        });
      }

      const userId = req.user.id;
      const notification = await NotificationModel.findById(value.id);

      // Verificar se a notificação pertence ao usuário
      if (notification.usuario_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }

      res.json({
        success: true,
        message: 'Notificação encontrada',
        data: {
          notification
        }
      });

    } catch (error) {
      console.error('Erro ao buscar notificação:', error);
      
      if (error.message === 'Notificação não encontrada') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // ✅ Marcar notificação como lida
  static async markAsRead(req, res) {
    try {
      const { error, value } = markAsReadSchema.validate({ id: parseInt(req.params.id) });
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'ID inválido',
          errors: error.details.map(detail => detail.message)
        });
      }

      const userId = req.user.id;
      const notification = await NotificationModel.markAsRead(value.id, userId);

      res.json({
        success: true,
        message: 'Notificação marcada como lida',
        data: {
          notification
        }
      });

    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      
      if (error.message === 'Notificação não encontrada') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      if (error.message === 'Notificação já foi lida') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // ✅ Marcar todas as notificações como lidas
  static async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;
      const result = await NotificationModel.markAllAsRead(userId);

      res.json({
        success: true,
        message: `${result.count} notificações marcadas como lidas`,
        data: {
          updated_count: result.count
        }
      });

    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // 🗑️ Deletar notificação
  static async deleteNotification(req, res) {
    try {
      const { error, value } = getNotificationSchema.validate({ id: parseInt(req.params.id) });
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'ID inválido',
          errors: error.details.map(detail => detail.message)
        });
      }

      const userId = req.user.id;
      const result = await NotificationModel.delete(value.id, userId);

      res.json({
        success: true,
        message: result.message
      });

    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
      
      if (error.message === 'Notificação não encontrada') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // 📊 Obter estatísticas das notificações
  static async getStats(req, res) {
    try {
      const userId = req.user.id;
      const stats = await NotificationModel.getUserStats(userId);

      res.json({
        success: true,
        message: 'Estatísticas obtidas com sucesso',
        data: {
          stats
        }
      });

    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // 📩 Criar notificação (admin apenas)
  static async createNotification(req, res) {
    try {
      const { error, value } = createNotificationSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.details.map(detail => detail.message)
        });
      }

      const notification = await NotificationModel.create(value);

      res.status(201).json({
        success: true,
        message: 'Notificação criada com sucesso',
        data: {
          notification
        }
      });

    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // 📝 Atualizar notificação (admin apenas)
  static async updateNotification(req, res) {
    try {
      const notificationId = parseInt(req.params.id);
      
      if (!notificationId) {
        return res.status(400).json({
          success: false,
          message: 'ID da notificação é obrigatório'
        });
      }

      const { error, value } = updateNotificationSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.details.map(detail => detail.message)
        });
      }

      const notification = await NotificationModel.findById(notificationId);
      
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notificação não encontrada'
        });
      }

      const updatedNotification = await NotificationModel.update(notificationId, value);

      res.json({
        success: true,
        message: 'Notificação atualizada com sucesso',
        data: {
          notification: updatedNotification
        }
      });

    } catch (error) {
      console.error('Erro ao atualizar notificação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // 🗑️ Deletar notificação (admin apenas)
  static async deleteNotification(req, res) {
    try {
      const notificationId = parseInt(req.params.id);
      
      if (!notificationId) {
        return res.status(400).json({
          success: false,
          message: 'ID da notificação é obrigatório'
        });
      }

      const notification = await NotificationModel.findById(notificationId);
      
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: 'Notificação não encontrada'
        });
      }

      await NotificationModel.delete(notificationId);

      res.json({
        success: true,
        message: 'Notificação deletada com sucesso'
      });

    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // 📊 Listar todas as notificações (admin apenas)
  static async getAllNotifications(req, res) {
    try {
      const { error, value } = listNotificationsSchema.validate(req.query);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Parâmetros inválidos',
          errors: error.details.map(detail => detail.message)
        });
      }

      const result = await NotificationModel.findAll(value);

      res.json({
        success: true,
        message: 'Notificações listadas com sucesso',
        data: {
          notifications: result.notifications,
          pagination: result.pagination,
          stats: result.stats
        }
      });

    } catch (error) {
      console.error('Erro ao listar todas as notificações:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // 📈 Estatísticas globais (admin apenas)
  static async getGlobalStats(req, res) {
    try {
      const stats = await NotificationModel.getGlobalStats();

      res.json({
        success: true,
        message: 'Estatísticas obtidas com sucesso',
        data: {
          stats
        }
      });

    } catch (error) {
      console.error('Erro ao obter estatísticas globais:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}
