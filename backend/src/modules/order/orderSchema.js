import Joi from 'joi';

// 📋 Schema para listar pedidos (filtros)
export const listOrdersSchema = Joi.object({
  status: Joi.string().valid('pendente', 'processando', 'enviado', 'entregue', 'cancelado').optional(),
  page: Joi.number().integer().min(1).default(1).optional(),
  limit: Joi.number().integer().min(1).max(100).default(10).optional(),
  data_inicio: Joi.date().optional(),
  data_fim: Joi.date().optional()
});

// 🔄 Schema para atualizar status do pedido (Admin)
export const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid('pendente', 'processando', 'enviado', 'entregue', 'cancelado').required().messages({
    'any.only': 'Status deve ser: pendente, processando, enviado, entregue ou cancelado',
    'any.required': 'Status é obrigatório'
  }),
  observacoes_admin: Joi.string().max(500).optional().messages({
    'string.max': 'Observações do admin devem ter no máximo 500 caracteres'
  })
});

// 📊 Schema para relatórios (Admin)
export const orderReportsSchema = Joi.object({
  periodo: Joi.string().valid('dia', 'semana', 'mes', 'ano').default('mes').optional(),
  data_inicio: Joi.date().optional(),
  data_fim: Joi.date().optional(),
  status: Joi.string().valid('pendente', 'processando', 'enviado', 'entregue', 'cancelado').optional()
});

// 🔍 Schema para buscar pedidos (Admin)
export const searchOrdersSchema = Joi.object({
  termo: Joi.string().min(1).max(100).optional().messages({
    'string.min': 'Termo de busca deve ter pelo menos 1 caractere',
    'string.max': 'Termo de busca deve ter no máximo 100 caracteres'
  }),
  usuario_id: Joi.number().integer().positive().optional(),
  status: Joi.string().valid('pendente', 'processando', 'enviado', 'entregue', 'cancelado').optional(),
  metodo_pagamento: Joi.string().valid('credit_card', 'debit_card', 'pix', 'boleto').optional(),
  page: Joi.number().integer().min(1).default(1).optional(),
  limit: Joi.number().integer().min(1).max(100).default(20).optional()
});
