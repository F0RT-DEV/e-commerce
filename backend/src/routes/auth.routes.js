import { Router } from "express";
import authController from "../modules/auth/authController.js";
import userController from "../modules/user/userController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

// Rota de teste para debug
router.post("/test", (req, res) => {
  console.log('🧪 Teste - Body:', req.body);
  console.log('🧪 Teste - Headers:', req.headers);
  res.json({ 
    message: "Teste OK", 
    body: req.body,
    headers: req.headers 
  });
});

// Rotas de autenticação (não requerem token)
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// Rotas de usuário autenticado (requerem token)
router.get("/me", authenticateToken, userController.getProfile);
router.patch("/me", authenticateToken, userController.updateProfile);
router.delete("/me", authenticateToken, userController.deleteAccount);
router.patch("/me/password", authenticateToken, userController.updatePassword);
router.patch("/me/email", authenticateToken, userController.updateEmail);
router.get("/me/stats", authenticateToken, userController.getStats);

export default router;