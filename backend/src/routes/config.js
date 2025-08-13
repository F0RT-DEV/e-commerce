// Configurações centralizadas das rotas da API
export const API_CONFIG = {
  version: 'v1',
  prefix: '/api',
  
  // Rotas de autenticação
  auth: {
    base: '/auth',
    endpoints: {
      register: '/register',
      login: '/login',
      me: '/me',
      forgotPassword: '/forgot-password',
      resetPassword: '/reset-password',
      test: '/test'
    }
  },
  
  // Rotas de administração
  admin: {
    base: '/admin',
    endpoints: {
      categories: '/categories',
      products: '/products',
      orders: '/orders',
      coupons: '/coupons',
      users: '/users'
    }
  },
  
  // Rotas do cliente
  client: {
    base: '/client',
    endpoints: {
      cart: '/cart',
      orders: '/orders',
      reviews: '/reviews',
      notifications: '/notifications',
      profile: '/profile'
    }
  },
  
  // Rotas públicas
  public: {
    base: '/public',
    endpoints: {
      products: '/products',
      categories: '/categories'
    }
  }
};

// Helper para construir URLs completas
export const buildRoute = (module, endpoint) => {
  return `${API_CONFIG.prefix}${API_CONFIG[module].base}${API_CONFIG[module].endpoints[endpoint]}`;
};

// URLs completas para referência
export const ROUTES = {
  // Auth routes
  AUTH_REGISTER: buildRoute('auth', 'register'),
  AUTH_LOGIN: buildRoute('auth', 'login'),
  AUTH_ME: buildRoute('auth', 'me'),
  AUTH_FORGOT_PASSWORD: buildRoute('auth', 'forgotPassword'),
  AUTH_RESET_PASSWORD: buildRoute('auth', 'resetPassword'),
  AUTH_TEST: buildRoute('auth', 'test'),
  
  // Admin routes
  ADMIN_CATEGORIES: buildRoute('admin', 'categories'),
  ADMIN_PRODUCTS: buildRoute('admin', 'products'),
  ADMIN_ORDERS: buildRoute('admin', 'orders'),
  ADMIN_COUPONS: buildRoute('admin', 'coupons'),
  
  // Client routes
  CLIENT_CART: buildRoute('client', 'cart'),
  CLIENT_ORDERS: buildRoute('client', 'orders'),
  CLIENT_REVIEWS: buildRoute('client', 'reviews'),
  CLIENT_NOTIFICATIONS: buildRoute('client', 'notifications'),
  
  // Public routes
  PUBLIC_PRODUCTS: buildRoute('public', 'products'),
  PUBLIC_CATEGORIES: buildRoute('public', 'categories')
};
