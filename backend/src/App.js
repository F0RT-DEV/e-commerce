
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import routes from "./routes/index.js"; // Um index.js que importa as rotas
import { setupDatabaseManual } from "./config/manualDatabase.js"; // ✅ Configuração manual

dotenv.config();

// 🗃️ Configurar banco sem migrations (OPCIONAL)
// setupDatabaseManual();

const app = express();

// Middleware de logging
app.use((req, res, next) => {
	console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
	console.log('📦 Headers:', JSON.stringify(req.headers, null, 2));
	next();
});

app.use(cors({
	origin: true,
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 🛒 Configuração de sessão para carrinho
app.use(session({
	secret: process.env.SESSION_SECRET || 'ecommerce-cart-secret-key',
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: process.env.NODE_ENV === 'production',
		httpOnly: true,
		maxAge: 24 * 60 * 60 * 1000 // 24 horas
	}
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para debug do body
app.use((req, res, next) => {
	if (req.method === 'POST' || req.method === 'PUT') {
		console.log('📝 Body recebido:', JSON.stringify(req.body, null, 2));
		console.log('📏 Content-Length:', req.headers['content-length']);
		console.log('🏷️  Content-Type:', req.headers['content-type']);
	}
	next();
});
app.use("/uploads", express.static("uploads")); // Para imagens, etc

app.use(routes); // Todas as rotas centralizadas

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
	console.error('❌ Erro capturado:', err);
	console.error('Stack trace:', err.stack);
	res.status(500).json({ 
		error: "Erro interno do servidor",
		message: err.message,
		timestamp: new Date().toISOString()
	});
});

// Rota para URLs não encontradas
app.use('*', (req, res) => {
	console.log(`⚠️  Rota não encontrada: ${req.method} ${req.originalUrl}`);
	res.status(404).json({ 
		error: "Rota não encontrada",
		path: req.originalUrl,
		method: req.method
	});
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
	console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
	console.log(`� Status da API: http://localhost:${PORT}/api/status`);
	console.log(`📋 Rotas de Autenticação ({{rota}}):`);
	console.log(`   POST http://localhost:${PORT}/api/auth/register`);
	console.log(`   POST http://localhost:${PORT}/api/auth/login`);
	console.log(`   GET  http://localhost:${PORT}/api/auth/me`);
	console.log(`   POST http://localhost:${PORT}/api/auth/forgot-password`);
	console.log(`   POST http://localhost:${PORT}/api/auth/reset-password`);
	console.log(`   POST http://localhost:${PORT}/api/auth/test`);
	console.log(`\n💡 Configure o Postman com as variáveis:`);
	console.log(`   baseURL: http://localhost:${PORT}`);
	console.log(`   rota: {{baseURL}}/api/auth`);
	console.log(`\n📦 Importe os arquivos Postman para configuração automática!`);
});
