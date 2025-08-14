import express from 'express';
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  checkout
} from '../../modules/cart/cartController.js';
import { authenticateToken } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// 🔐 Todas as rotas do carrinho requerem autenticação
router.use(authenticateToken);

// 🛒 ROTAS DO CARRINHO

// GET /api/client/cart - Visualizar carrinho
router.get('/', getCart);

// POST /api/client/cart - Adicionar produto ao carrinho
router.post('/', addToCart);

// PATCH /api/client/cart/:produto_id - Atualizar quantidade do item
router.patch('/:produto_id', updateCartItem);

// DELETE /api/client/cart/:produto_id - Remover item do carrinho
router.delete('/:produto_id', removeFromCart);

// DELETE /api/client/cart - Limpar carrinho
router.delete('/', clearCart);

// POST /api/client/cart/checkout - Finalizar compra
router.post('/checkout', checkout);

export default router;