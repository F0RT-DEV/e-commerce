import Joi from 'joi';

// 📋 Schema para criar notificação
export const createNotificationSchema = Joi.object({
  usuario_id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'ID do usuário deve ser um número',
      'number.integer': 'ID do usuário deve ser um número inteiro',
      'number.positive': 'ID do usuário deve ser positivo',
      'any.required': 'ID do usuário é obrigatório'
    }),

  titulo: Joi.string().max(100).required()
    .messages({
      'string.base': 'Título deve ser um texto',
      'string.max': 'Título deve ter no máximo 100 caracteres',
      'any.required': 'Título é obrigatório'
    }),

  mensagem: Joi.string().required()
    .messages({
      'string.base': 'Mensagem deve ser um texto',
      'any.required': 'Mensagem é obrigatória'
    }),

  tipo: Joi.string().valid('sistema', 'promocao', 'pedido', 'geral').default('geral')
    .messages({
      'string.base': 'Tipo deve ser um texto',
      'any.only': 'Tipo deve ser um dos valores: sistema, promocao, pedido, geral'
    })
});

// 📋 Schema para atualizar notificação
export const updateNotificationSchema = Joi.object({
  titulo: Joi.string().max(100).optional()
    .messages({
      'string.base': 'Título deve ser um texto',
      'string.max': 'Título deve ter no máximo 100 caracteres'
    }),

  mensagem: Joi.string().optional()
    .messages({
      'string.base': 'Mensagem deve ser um texto'
    }),

  tipo: Joi.string().valid('sistema', 'promocao', 'pedido', 'geral').optional()
    .messages({
      'string.base': 'Tipo deve ser um texto',
      'any.only': 'Tipo deve ser um dos valores: sistema, promocao, pedido, geral'
    }),

  lida: Joi.boolean().optional()
    .messages({
      'boolean.base': 'Status de leitura deve ser verdadeiro ou falso'
    })
}).min(1).messages({
  'object.min': 'Pelo menos um campo deve ser fornecido para atualização'
});

// 📋 Schema para listar notificações (query params)
export const listNotificationsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1)
    .messages({
      'number.base': 'Página deve ser um número',
      'number.integer': 'Página deve ser um número inteiro',
      'number.min': 'Página deve ser maior que 0'
    }),

  limit: Joi.number().integer().min(1).max(100).default(20)
    .messages({
      'number.base': 'Limite deve ser um número',
      'number.integer': 'Limite deve ser um número inteiro',
      'number.min': 'Limite deve ser maior que 0',
      'number.max': 'Limite deve ser no máximo 100'
    }),

  lida: Joi.boolean().optional()
    .messages({
      'boolean.base': 'Status de leitura deve ser verdadeiro ou falso'
    }),

  order: Joi.string().valid('asc', 'desc').default('desc')
    .messages({
      'any.only': 'Ordenação deve ser "asc" ou "desc"'
    })
});

// 📋 Schema para marcar como lida
export const markAsReadSchema = Joi.object({
  id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'ID deve ser um número',
      'number.integer': 'ID deve ser um número inteiro',
      'number.positive': 'ID deve ser positivo',
      'any.required': 'ID é obrigatório'
    })
});

// 📋 Schema para buscar notificação por ID
export const getNotificationSchema = Joi.object({
  id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'ID deve ser um número',
      'number.integer': 'ID deve ser um número inteiro',
      'number.positive': 'ID deve ser positivo',
      'any.required': 'ID é obrigatório'
    })
});
