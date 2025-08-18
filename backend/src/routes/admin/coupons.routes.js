import express from 'express';
import { CouponController } from '../../modules/coupon/couponController.js';
import { authenticateToken } from '../../middlewares/authMiddleware.js';
import { verifyAdminRole } from '../../middlewares/role.middleware.js';

const router = express.Router();

// Middleware de autenticação para todas as rotas
router.use(authenticateToken);
router.use(verifyAdminRole);

/**
 * @route   POST /api/admin/coupons
 * @desc    Criar novo cupom
 * @access  Admin
 */
router.post('/', CouponController.create);

/**
 * @route   GET /api/admin/coupons
 * @desc    Listar cupons com filtros e paginação
 * @access  Admin
 */
router.get('/', CouponController.list);

/**
 * @route   GET /api/admin/coupons/stats
 * @desc    Obter estatísticas dos cupons
 * @access  Admin
 */
router.get('/stats', CouponController.getStats);

/**
 * @route   GET /api/admin/coupons/:id
 * @desc    Buscar cupom por ID
 * @access  Admin
 */
router.get('/:id', CouponController.findById);

/**
 * @route   PUT /api/admin/coupons/:id
 * @desc    Atualizar cupom
 * @access  Admin
 */
router.put('/:id', CouponController.update);

/**
 * @route   PATCH /api/admin/coupons/:id
 * @desc    Atualizar cupom (parcial)
 * @access  Admin
 */
router.patch('/:id', CouponController.update);

/**
 * @route   DELETE /api/admin/coupons/:id
 * @desc    Deletar cupom
 * @access  Admin
 */
router.delete('/:id', CouponController.delete);

export default router;
