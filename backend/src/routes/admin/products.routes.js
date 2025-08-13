import express from 'express';
import {
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
  listAllProductsAdmin,
  getProductDetailsAdmin,
  updateProductStock,
  getProductStatistics
} from '../../modules/product/productController.js';

import { authenticateToken } from '../../middlewares/authMiddleware.js';
import { verifyAdminRole } from '../../middlewares/role.middleware.js';

const router = express.Router();

// 🔒 Todas as rotas admin requerem autenticação e permissão de admin
router.use(authenticateToken);
router.use(verifyAdminRole);

// 🛍️ ROTAS ADMIN DE PRODUTOS

// GET /api/admin/products/stats - Estatísticas de produtos
router.get('/stats', getProductStatistics);

// GET /api/admin/products - Listar todos os produtos (admin)
router.get('/', listAllProductsAdmin);

// POST /api/admin/products - Criar novo produto
router.post('/', createProductAdmin);

// GET /api/admin/products/:id - Detalhes do produto (admin)
router.get('/:id', getProductDetailsAdmin);

// PATCH /api/admin/products/:id - Atualizar produto
router.patch('/:id', updateProductAdmin);

// PUT /api/admin/products/:id - Atualizar produto (compatibilidade)
router.put('/:id', updateProductAdmin);

// DELETE /api/admin/products/:id - Remover produto
router.delete('/:id', deleteProductAdmin);

// PATCH /api/admin/products/:id/stock - Atualizar estoque
router.patch('/:id/stock', updateProductStock);

export default router;
