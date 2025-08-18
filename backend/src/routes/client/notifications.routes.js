import express from 'express';
import { NotificationController } from '../../modules/notification/notificationController.js';
import { authenticateToken } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// 🔐 Todas as rotas requerem autenticação
router.use(authenticateToken);

/**
 * @route   GET /api/client/notifications
 * @desc    Listar notificações do usuário
 * @access  Private (Cliente)
 * @query   ?page=1&limit=20&lida=true&order=desc
 */
router.get('/', NotificationController.getUserNotifications);

/**
 * @route   GET /api/client/notifications/stats
 * @desc    Estatísticas das notificações do usuário
 * @access  Private (Cliente)
 */
router.get('/stats', NotificationController.getStats);

/**
 * @route   GET /api/client/notifications/:id
 * @desc    Obter notificação específica
 * @access  Private (Cliente)
 */
router.get('/:id', NotificationController.getNotification);

/**
 * @route   PATCH /api/client/notifications/:id/read
 * @desc    Marcar notificação como lida
 * @access  Private (Cliente)
 */
router.patch('/:id/read', NotificationController.markAsRead);

/**
 * @route   PATCH /api/client/notifications/read-all
 * @desc    Marcar todas as notificações como lidas
 * @access  Private (Cliente)
 */
router.patch('/read-all', NotificationController.markAllAsRead);

/**
 * @route   POST /api/client/notifications/mark-all-read
 * @desc    Marcar todas as notificações como lidas (alias)
 * @access  Private (Cliente)
 */
router.post('/mark-all-read', NotificationController.markAllAsRead);

/**
 * @route   DELETE /api/client/notifications/:id
 * @desc    Deletar notificação
 * @access  Private (Cliente)
 */
router.delete('/:id', NotificationController.deleteNotification);

export default router;
