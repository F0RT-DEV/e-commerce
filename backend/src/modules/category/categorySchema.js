import Joi from 'joi';

// 🏷️ Schema para criar categoria (Admin)
export const createCategorySchema = Joi.object({
  nome: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Nome é obrigatório',
    'string.min': 'Nome deve ter no mínimo 2 caracteres',
    'string.max': 'Nome deve ter no máximo 50 caracteres',
    'any.required': 'Nome é obrigatório'
  })
});

// ✏️ Schema para atualizar categoria (Admin)
export const updateCategorySchema = Joi.object({
  nome: Joi.string().min(2).max(50).messages({
    'string.min': 'Nome deve ter no mínimo 2 caracteres',
    'string.max': 'Nome deve ter no máximo 50 caracteres'
  })
}).min(1); // Pelo menos um campo deve ser fornecido

// 🔍 Schema para filtros de busca de categorias
export const searchCategorySchema = Joi.object({
  q: Joi.string().max(50).messages({
    'string.max': 'Busca deve ter no máximo 50 caracteres'
  }),
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Página deve ser um número',
    'number.integer': 'Página deve ser um número inteiro',
    'number.min': 'Página deve ser no mínimo 1'
  }),
  limit: Joi.number().integer().min(1).max(50).default(10).messages({
    'number.base': 'Limite deve ser um número',
    'number.integer': 'Limite deve ser um número inteiro',
    'number.min': 'Limite deve ser no mínimo 1',
    'number.max': 'Limite deve ser no máximo 50'
  })
});