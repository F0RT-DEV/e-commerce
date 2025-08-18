import express from 'express';
import { CouponController } from '../../modules/coupon/couponController.js';
import { authenticateToken } from '../../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/coupons
 * @desc    Listar cupons ativos (público)
 * @access  Public
 */
router.get('/', CouponController.listActive);

/**
 * @route   POST /api/coupons/verify
 * @desc    Verificar se cupom é válido
 * @access  Public
 */
router.post('/verify', CouponController.verify);

export default router;
