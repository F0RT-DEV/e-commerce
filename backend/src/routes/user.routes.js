import { Router } from "express";
import userController from "../modules/user/userController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Gerenciamento de perfil
router.get("/me", userController.getProfile);           // GET /api/auth/me
router.patch("/me", userController.updateProfile);      // PATCH /api/auth/me
router.delete("/me", userController.deleteAccount);     // DELETE /api/auth/me

// Alterações específicas (mais seguras)
router.patch("/me/password", userController.updatePassword);  // PATCH /api/auth/me/password
router.patch("/me/email", userController.updateEmail);        // PATCH /api/auth/me/email

// Estatísticas do usuário
router.get("/me/stats", userController.getStats);       // GET /api/auth/me/stats

export default router;
