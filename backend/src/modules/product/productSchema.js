import Joi from 'joi';

// 🛍️ Schema para criar produto (Admin)
export const createProductSchema = Joi.object({
  nome: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Nome é obrigatório',
    'string.min': 'Nome deve ter no mínimo 2 caracteres',
    'string.max': 'Nome deve ter no máximo 100 caracteres'
  }),
  descricao: Joi.string().max(1000).allow('').messages({
    'string.max': 'Descrição deve ter no máximo 1000 caracteres'
  }),
  preco: Joi.number().positive().precision(2).required().messages({
    'number.base': 'Preço deve ser um número',
    'number.positive': 'Preço deve ser maior que zero',
    'any.required': 'Preço é obrigatório'
  }),
  estoque: Joi.number().integer().min(0).required().messages({
    'number.base': 'Estoque deve ser um número',
    'number.integer': 'Estoque deve ser um número inteiro',
    'number.min': 'Estoque não pode ser negativo',
    'any.required': 'Estoque é obrigatório'
  }),
  categoria_id: Joi.number().integer().positive().required().messages({
    'number.base': 'Categoria deve ser um número',
    'number.integer': 'Categoria deve ser um número inteiro',
    'number.positive': 'Categoria deve ser válida',
    'any.required': 'Categoria é obrigatória'
  }),
  imagem: Joi.string().max(255).allow('').messages({
    'string.max': 'URL da imagem deve ter no máximo 255 caracteres'
  })
});

// ✏️ Schema para atualizar produto (Admin)
export const updateProductSchema = Joi.object({
  nome: Joi.string().min(2).max(100).messages({
    'string.min': 'Nome deve ter no mínimo 2 caracteres',
    'string.max': 'Nome deve ter no máximo 100 caracteres'
  }),
  descricao: Joi.string().max(1000).allow('').messages({
    'string.max': 'Descrição deve ter no máximo 1000 caracteres'
  }),
  preco: Joi.number().positive().precision(2).messages({
    'number.base': 'Preço deve ser um número',
    'number.positive': 'Preço deve ser maior que zero'
  }),
  estoque: Joi.number().integer().min(0).messages({
    'number.base': 'Estoque deve ser um número',
    'number.integer': 'Estoque deve ser um número inteiro',
    'number.min': 'Estoque não pode ser negativo'
  }),
  categoria_id: Joi.number().integer().positive().messages({
    'number.base': 'Categoria deve ser um número',
    'number.integer': 'Categoria deve ser um número inteiro',
    'number.positive': 'Categoria deve ser válida'
  }),
  imagem: Joi.string().max(255).allow('').messages({
    'string.max': 'URL da imagem deve ter no máximo 255 caracteres'
  })
}).min(1); // Pelo menos um campo deve ser fornecido

// 🔍 Schema para filtros de busca
export const searchProductSchema = Joi.object({
  categoria_id: Joi.number().integer().positive().messages({
    'number.base': 'Categoria deve ser um número',
    'number.integer': 'Categoria deve ser um número inteiro',
    'number.positive': 'Categoria deve ser válida'
  }),
  q: Joi.string().max(100).messages({
    'string.max': 'Busca deve ter no máximo 100 caracteres'
  }),
  search: Joi.string().max(100).messages({
    'string.max': 'Busca deve ter no máximo 100 caracteres'
  }),
  preco_min: Joi.number().positive().messages({
    'number.base': 'Preço mínimo deve ser um número',
    'number.positive': 'Preço mínimo deve ser maior que zero'
  }),
  preco_max: Joi.number().positive().messages({
    'number.base': 'Preço máximo deve ser um número',
    'number.positive': 'Preço máximo deve ser maior que zero'
  }),
  ordenar: Joi.string().valid('nome', 'preco', 'criado_em', 'estoque').messages({
    'any.only': 'Ordenar deve ser: nome, preco, criado_em ou estoque'
  }),
  direcao: Joi.string().valid('ASC', 'DESC').default('ASC').messages({
    'any.only': 'Direção deve ser ASC ou DESC'
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
