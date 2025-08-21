import express from 'express';
import { ReviewController } from '../../modules/review/reviewController.js';
import { authenticateToken } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// 🔐 Todas as rotas requerem autenticação
router.use(authenticateToken);

/**
 * @route   POST /api/client/products/:produto_id/review
 * @desc    Criar avaliação para um produto
 * @access  Private (Cliente)
 * @body    { "nota": 5, "comentario": "Excelente produto!" }
 */
router.post('/products/:produto_id/review', ReviewController.createReview);

/**
 * @route   GET /api/client/reviews
 * @desc    Listar avaliações do usuário logado
 * @access  Private (Cliente)
 * @query   ?page=1&limit=10&order=desc
 */
router.get('/reviews', ReviewController.getUserReviews);

/**
 * @route   GET /api/client/reviews/:id
 * @desc    Buscar avaliação específica do usuário
 * @access  Private (Cliente)
 */
router.get('/reviews/:id', ReviewController.getReview);

/**
 * @route   PUT /api/client/reviews/:id
 * @desc    Atualizar avaliação do usuário
 * @access  Private (Cliente)
 * @body    { "nota": 4, "comentario": "Bom produto, mas pode melhorar" }
 */
router.put('/reviews/:id', ReviewController.updateReview);

/**
 * @route   DELETE /api/client/reviews/:id
 * @desc    Deletar avaliação do usuário
 * @access  Private (Cliente)
 */
router.delete('/reviews/:id', ReviewController.deleteReview);

export default router;
