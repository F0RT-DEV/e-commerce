import express from 'express';
import { authenticateToken } from '../../middlewares/authMiddleware.js';
import { 
  listUserOrders, 
  getUserOrder 
} from '../../modules/order/orderController.js';

const router = express.Router();

// 📋 Todas as rotas requerem autenticação
router.use(authenticateToken);

// 📋 Listar pedidos do cliente
router.get('/', listUserOrders);

// 🔍 Buscar pedido específico do cliente
router.get('/:id', getUserOrder);

export default router;
