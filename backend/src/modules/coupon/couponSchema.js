import Joi from 'joi';

// Schema para criar cupom (admin)
export const createCouponSchema = Joi.object({
  codigo: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[A-Z0-9_-]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Código deve conter apenas letras maiúsculas, números, underscore e hífen',
      'string.min': 'Código deve ter no mínimo 3 caracteres',
      'string.max': 'Código deve ter no máximo 50 caracteres',
      'any.required': 'Código é obrigatório'
    }),
  
  tipo: Joi.string()
    .valid('percentual', 'valor_fixo')
    .required()
    .messages({
      'any.only': 'Tipo deve ser "percentual" ou "valor_fixo"',
      'any.required': 'Tipo é obrigatório'
    }),
  
  valor: Joi.number()
    .positive()
    .precision(2)
    .required()
    .when('tipo', {
      is: 'percentual',
      then: Joi.number().max(100).messages({
        'number.max': 'Percentual não pode ser maior que 100%'
      })
    })
    .messages({
      'number.positive': 'Valor deve ser positivo',
      'any.required': 'Valor é obrigatório'
    }),
  
  validade: Joi.date()
    .iso()
    .min('now')
    .required()
    .messages({
      'date.min': 'Data de validade deve ser no futuro',
      'any.required': 'Data de validade é obrigatória'
    }),
  
  uso_maximo: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.min': 'Uso máximo deve ser no mínimo 1',
      'number.integer': 'Uso máximo deve ser um número inteiro'
    }),
  
  ativo: Joi.boolean()
    .default(true)
});

// Schema para atualizar cupom (admin)
export const updateCouponSchema = Joi.object({
  codigo: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[A-Z0-9_-]+$/)
    .messages({
      'string.pattern.base': 'Código deve conter apenas letras maiúsculas, números, underscore e hífen',
      'string.min': 'Código deve ter no mínimo 3 caracteres',
      'string.max': 'Código deve ter no máximo 50 caracteres'
    }),
  
  tipo: Joi.string()
    .valid('percentual', 'valor_fixo')
    .messages({
      'any.only': 'Tipo deve ser "percentual" ou "valor_fixo"'
    }),
  
  valor: Joi.number()
    .positive()
    .precision(2)
    .when('tipo', {
      is: 'percentual',
      then: Joi.number().max(100).messages({
        'number.max': 'Percentual não pode ser maior que 100%'
      })
    })
    .messages({
      'number.positive': 'Valor deve ser positivo'
    }),
  
  validade: Joi.date()
    .iso()
    .min('now')
    .messages({
      'date.min': 'Data de validade deve ser no futuro'
    }),
  
  uso_maximo: Joi.number()
    .integer()
    .min(1)
    .messages({
      'number.min': 'Uso máximo deve ser no mínimo 1',
      'number.integer': 'Uso máximo deve ser um número inteiro'
    }),
  
  ativo: Joi.boolean()
}).min(1).messages({
  'object.min': 'Pelo menos um campo deve ser fornecido para atualização'
});

// Schema para aplicar cupom
export const applyCouponSchema = Joi.object({
  codigo: Joi.string()
    .required()
    .messages({
      'any.required': 'Código do cupom é obrigatório'
    })
});

// Schema para verificar cupom
export const verifyCouponSchema = Joi.object({
  codigo: Joi.string()
    .required()
    .messages({
      'any.required': 'Código do cupom é obrigatório'
    })
});

// Schema para listar cupons (admin)
export const listCouponsSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10),
  
  tipo: Joi.string()
    .valid('percentual', 'valor_fixo'),
  
  ativo: Joi.boolean(),
  
  search: Joi.string()
    .max(100),
  
  sort: Joi.string()
    .valid('codigo', 'valor', 'validade', 'created_at')
    .default('created_at'),
  
  order: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
});
