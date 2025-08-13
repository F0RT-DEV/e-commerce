import express from 'express';
import {
  listProducts,
  getProductDetails,
  searchProducts
} from '../modules/product/productController.js';

const router = express.Router();

// 🛍️ ROTAS PÚBLICAS DE PRODUTOS

// GET /api/public/products - Listar produtos disponíveis
router.get('/', listProducts);

// GET /api/public/products/search - Buscar produtos (DEVE vir antes da rota /:id)
router.get('/search', searchProducts);

// GET /api/public/products/:id - Detalhes de um produto
router.get('/:id', getProductDetails);

export default router;
