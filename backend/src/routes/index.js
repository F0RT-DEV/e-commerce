import { Router } from "express";
import { API_CONFIG } from "./config.js";
import authRoutes from "./auth.routes.js";
// Importar outras rotas conforme necessário
// import adminProductRoutes from "./admin/products.routes.js";
// import adminCategoryRoutes from "./admin/categories.routes.js";
// import clientOrderRoutes from "./client/orders.routes.js";

const router = Router();

// Log das rotas carregadas
console.log('🛣️  Carregando rotas da API...');

// Rota de status da API
router.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online',
    timestamp: new Date().toISOString(),
    version: API_CONFIG.version,
    routes: {
      auth: `${API_CONFIG.prefix}${API_CONFIG.auth.base}`,
      admin: `${API_CONFIG.prefix}${API_CONFIG.admin.base}`,
      client: `${API_CONFIG.prefix}${API_CONFIG.client.base}`,
      public: `${API_CONFIG.prefix}${API_CONFIG.public.base}`
    }
  });
});

// Rotas de autenticação
router.use(`${API_CONFIG.prefix}${API_CONFIG.auth.base}`, authRoutes);
console.log(`✅ Rotas de autenticação: ${API_CONFIG.prefix}${API_CONFIG.auth.base}`);

// Rotas de administração (quando implementadas)
// router.use(`${API_CONFIG.prefix}${API_CONFIG.admin.base}/products`, adminProductRoutes);
// router.use(`${API_CONFIG.prefix}${API_CONFIG.admin.base}/categories`, adminCategoryRoutes);

// Rotas do cliente (quando implementadas)
// router.use(`${API_CONFIG.prefix}${API_CONFIG.client.base}/orders`, clientOrderRoutes);

// Middleware para rotas não encontradas
router.use('*', (req, res) => {
  console.log(`⚠️  Rota não encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Rota não encontrada',
    method: req.method,
    path: req.originalUrl,
    availableRoutes: {
      auth: `${API_CONFIG.prefix}${API_CONFIG.auth.base}`,
      status: `${API_CONFIG.prefix}/status`
    }
  });
});

export default router;
