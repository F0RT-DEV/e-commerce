import express from 'express';
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  checkout
} from '../../modules/cart/cartController.js';
import { CouponController } from '../../modules/coupon/couponController.js';
import { authenticateToken } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// 🔐 Todas as rotas do carrinho requerem autenticação
router.use(authenticateToken);

// 🛒 ROTAS DO CARRINHO

// GET /api/client/cart - Visualizar carrinho
router.get('/', getCart);

// POST /api/client/cart - Adicionar produto ao carrinho
router.post('/', addToCart);

// 🎟️ ROTAS DE CUPONS NO CARRINHO (devem vir ANTES das rotas com parâmetros)

// POST /api/client/cart/apply-coupon - Aplicar cupom ao carrinho
router.post('/apply-coupon', CouponController.applyToCart);

// DELETE /api/client/cart/remove-coupon - Remover cupom do carrinho
router.delete('/remove-coupon', CouponController.removeFromCart);

// POST /api/client/cart/checkout - Finalizar compra
router.post('/checkout', checkout);

// 🛒 ROTAS COM PARÂMETROS (devem vir DEPOIS das rotas específicas)

// PATCH /api/client/cart/:produto_id - Atualizar quantidade do item
router.patch('/:produto_id', updateCartItem);

// DELETE /api/client/cart/:produto_id - Remover item do carrinho
router.delete('/:produto_id', removeFromCart);

// DELETE /api/client/cart - Limpar carrinho
router.delete('/', clearCart);

export default router;