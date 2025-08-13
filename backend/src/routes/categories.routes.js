import express from 'express';
import {
  listCategories,
  getCategoryDetails
} from '../modules/category/categoryController.js';

const router = express.Router();

// 🏷️ ROTAS PÚBLICAS DE CATEGORIAS

// GET /api/public/categories - Listar categorias disponíveis
router.get('/', listCategories);

// GET /api/public/categories/:id - Detalhes de uma categoria
router.get('/:id', getCategoryDetails);

export default router;
