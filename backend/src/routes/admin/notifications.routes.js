import express from 'express';
import { NotificationController } from '../../modules/notification/notificationController.js';
import { authenticateToken } from '../../middlewares/authMiddleware.js';
import { checkRole } from '../../middlewares/role.middleware.js';

const router = express.Router();

// 🔐 Todas as rotas requerem autenticação e role de admin
router.use(authenticateToken);
router.use(checkRole(['admin']));

/**
 * @route   GET /api/admin/notifications/stats
 * @desc    Estatísticas globais das notificações (admin)
 * @access  Private (Admin)
 */
router.get('/stats', NotificationController.getGlobalStats);

/**
 * @route   GET /api/admin/notifications
 * @desc    Listar todas as notificações (admin)
 * @access  Private (Admin)
 * @query   { page?, limit?, lida?, order? }
 */
router.get('/', NotificationController.getAllNotifications);

/**
 * @route   POST /api/admin/notifications
 * @desc    Criar notificação (admin)
 * @access  Private (Admin)
 * @body    { usuario_id, titulo, mensagem, tipo? }
 */
router.post('/', NotificationController.createNotification);

/**
 * @route   PATCH /api/admin/notifications/:id
 * @desc    Atualizar notificação (admin)
 * @access  Private (Admin)
 * @body    { titulo?, mensagem?, tipo?, lida? }
 */
router.patch('/:id', NotificationController.updateNotification);

/**
 * @route   DELETE /api/admin/notifications/:id
 * @desc    Deletar notificação (admin)
 * @access  Private (Admin)
 */
router.delete('/:id', NotificationController.deleteNotification);

export default router;
