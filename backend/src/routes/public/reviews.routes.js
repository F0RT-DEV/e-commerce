import express from 'express';
import { ReviewController } from '../../modules/review/reviewController.js';

const router = express.Router();

/**
 * @route   GET /api/public/products/:produto_id/reviews
 * @desc    Listar avaliações de um produto (público)
 * @access  Public
 * @query   ?page=1&limit=10&nota=5&order=desc
 */
router.get('/:produto_id/reviews', ReviewController.getProductReviews);

/**
 * @route   GET /api/public/products/:produto_id/reviews/stats
 * @desc    Estatísticas de avaliações de um produto
 * @access  Public
 */
router.get('/:produto_id/reviews/stats', ReviewController.getProductReviewStats);

export default router;
