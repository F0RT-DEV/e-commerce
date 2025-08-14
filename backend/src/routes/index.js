import { Router } from "express";
import { API_CONFIG } from "./config.js";
import authRoutes from "./auth.routes.js";
import productRoutes from "./products.routes.js";
import categoryRoutes from "./categories.routes.js";
import adminProductRoutes from "./admin/products.routes.js";
import adminCategoryRoutes from "./admin/categories.routes.js";
import adminOrderRoutes from "./admin/orders.routes.js";
import cartRoutes from "./client/cart.routes.js";
import clientOrderRoutes from "./client/orders.routes.js";

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
      products: `${API_CONFIG.prefix}${API_CONFIG.public.base}/products`,
      categories: `${API_CONFIG.prefix}${API_CONFIG.public.base}/categories`,
      admin: `${API_CONFIG.prefix}${API_CONFIG.admin.base}`,
      client: `${API_CONFIG.prefix}${API_CONFIG.client.base}`,
      public: `${API_CONFIG.prefix}${API_CONFIG.public.base}`
    }
  });
});

// Rotas de autenticação
router.use(`${API_CONFIG.prefix}${API_CONFIG.auth.base}`, authRoutes);
console.log(`✅ Rotas de autenticação: ${API_CONFIG.prefix}${API_CONFIG.auth.base}`);

// Rotas públicas de produtos
router.use(`${API_CONFIG.prefix}${API_CONFIG.public.base}/products`, productRoutes);
console.log(`✅ Rotas de produtos: ${API_CONFIG.prefix}${API_CONFIG.public.base}/products`);

// Rotas públicas de categorias
router.use(`${API_CONFIG.prefix}${API_CONFIG.public.base}/categories`, categoryRoutes);
console.log(`✅ Rotas de categorias: ${API_CONFIG.prefix}${API_CONFIG.public.base}/categories`);

// Rotas de administração - produtos
router.use(`${API_CONFIG.prefix}${API_CONFIG.admin.base}/products`, adminProductRoutes);
console.log(`✅ Rotas admin de produtos: ${API_CONFIG.prefix}${API_CONFIG.admin.base}/products`);

// Rotas de administração - categorias
router.use(`${API_CONFIG.prefix}${API_CONFIG.admin.base}/categories`, adminCategoryRoutes);
console.log(`✅ Rotas admin de categorias: ${API_CONFIG.prefix}${API_CONFIG.admin.base}/categories`);

// Rotas de administração - pedidos
router.use(`${API_CONFIG.prefix}${API_CONFIG.admin.base}/orders`, adminOrderRoutes);
console.log(`✅ Rotas admin de pedidos: ${API_CONFIG.prefix}${API_CONFIG.admin.base}/orders`);

// Rotas do cliente - carrinho
router.use(`${API_CONFIG.prefix}${API_CONFIG.client.base}/cart`, cartRoutes);
console.log(`✅ Rotas do carrinho: ${API_CONFIG.prefix}${API_CONFIG.client.base}/cart`);

// Rotas do cliente - pedidos
router.use(`${API_CONFIG.prefix}${API_CONFIG.client.base}/orders`, clientOrderRoutes);
console.log(`✅ Rotas de pedidos do cliente: ${API_CONFIG.prefix}${API_CONFIG.client.base}/orders`);

// Middleware para rotas não encontradas
router.use('*', (req, res) => {
  console.log(`⚠️  Rota não encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Rota não encontrada',
    method: req.method,
    path: req.originalUrl,
    availableRoutes: {
      auth: `${API_CONFIG.prefix}${API_CONFIG.auth.base}`,
      products: `${API_CONFIG.prefix}${API_CONFIG.public.base}/products`,
      admin: `${API_CONFIG.prefix}${API_CONFIG.admin.base}`,
      status: `${API_CONFIG.prefix}/status`
    }
  });
});

export default router;
