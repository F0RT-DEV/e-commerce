import Joi from 'joi';

// 📝 Schema para criar uma nova avaliação
export const createReviewSchema = Joi.object({
  nota: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      'number.base': 'A nota deve ser um número',
      'number.integer': 'A nota deve ser um número inteiro',
      'number.min': 'A nota deve ser entre 1 e 5 estrelas',
      'number.max': 'A nota deve ser entre 1 e 5 estrelas',
      'any.required': 'A nota é obrigatória'
    }),

  comentario: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'O comentário não pode ter mais de 1000 caracteres'
    })
});

// 📝 Schema para atualizar uma avaliação
export const updateReviewSchema = Joi.object({
  nota: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .messages({
      'number.base': 'A nota deve ser um número',
      'number.integer': 'A nota deve ser um número inteiro',
      'number.min': 'A nota deve ser entre 1 e 5 estrelas',
      'number.max': 'A nota deve ser entre 1 e 5 estrelas'
    }),

  comentario: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'O comentário não pode ter mais de 1000 caracteres'
    })
});

// 📝 Schema para filtros de consulta de avaliações
export const reviewQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.min': 'A página deve ser maior que 0'
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(50)
    .default(10)
    .messages({
      'number.min': 'O limite deve ser maior que 0',
      'number.max': 'O limite não pode ser maior que 50'
    }),

  nota: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .messages({
      'number.min': 'Filtro de nota deve ser entre 1 e 5',
      'number.max': 'Filtro de nota deve ser entre 1 e 5'
    }),

  order: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
    .messages({
      'any.only': 'Ordenação deve ser "asc" ou "desc"'
    })
});