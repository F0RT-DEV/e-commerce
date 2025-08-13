import express from 'express';
import {
  createCategoryAdmin,
  updateCategoryAdmin,
  deleteCategoryAdmin,
  getCategoryStatsAdmin,
  listCategories
} from '../../modules/category/categoryController.js';
import { authenticateToken } from '../../middlewares/authMiddleware.js';
import { verifyAdminRole } from '../../middlewares/role.middleware.js';

const router = express.Router();

// 🔐 Aplicar autenticação e verificação de admin em todas as rotas
router.use(authenticateToken);
router.use(verifyAdminRole);

// 🏷️ ROTAS ADMINISTRATIVAS DE CATEGORIAS

// GET /api/admin/categories - Listar todas as categorias (admin)
router.get('/', listCategories);

// POST /api/admin/categories - Criar nova categoria
router.post('/', createCategoryAdmin);

// PATCH /api/admin/categories/:id - Atualizar categoria
router.patch('/:id', updateCategoryAdmin);

// PUT /api/admin/categories/:id - Atualizar categoria (compatibilidade)
router.put('/:id', updateCategoryAdmin);

// DELETE /api/admin/categories/:id - Deletar categoria
router.delete('/:id', deleteCategoryAdmin);

// GET /api/admin/categories/stats - Estatísticas de categorias
router.get('/stats', getCategoryStatsAdmin);

export default router;