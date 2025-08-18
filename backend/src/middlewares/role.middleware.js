// src/middlewares/role.middleware.js
export async function verifyAdminRole(req, res, next) {
	if (req.user?.role !== "admin") {
		return res.status(403).send({ message: "Apenas administradores." });
	}
	next();
}

export async function verifyProviderRole(req, res, next) {
	if (req.user?.role !== "provider") {
		return res.status(403).send({ message: "Apenas prestadores." });
	}
	next();
}

export async function verifyUserRole(req, res, next) {
	if (req.user?.role !== "client") {
		return res.status(403).send({ message: "Apenas clientes." });
	}
	next();
}

// Função genérica para verificar múltiplos roles
export function checkRole(allowedRoles) {
	return (req, res, next) => {
		if (!req.user || !allowedRoles.includes(req.user.role)) {
			return res.status(403).json({
				success: false,
				message: "Acesso negado. Role não autorizado."
			});
		}
		next();
	};
}
