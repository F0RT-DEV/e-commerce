import express from 'express';
import { authenticateToken } from '../../middlewares/authMiddleware.js';
import { verifyAdminRole } from '../../middlewares/role.middleware.js';
import { 
  listAllOrders,
  getOrderDetailsAdmin, 
  updateOrderStatusAdmin,
  getOrderReports 
} from '../../modules/order/orderController.js';

const router = express.Router();

// 🔒 Todas as rotas requerem autenticação e permissão de admin
router.use(authenticateToken);
router.use(verifyAdminRole);

// 📊 Listar todos os pedidos (com filtros e busca)
router.get('/', listAllOrders);

// 📈 Relatórios e estatísticas de pedidos
router.get('/reports', getOrderReports);

// 🔍 Buscar pedido específico (visão admin)
router.get('/:id', getOrderDetailsAdmin);

// 🔄 Atualizar status do pedido
router.patch('/:id/status', updateOrderStatusAdmin);

export default router;
