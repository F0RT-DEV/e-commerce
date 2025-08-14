import Joi from 'joi';

// 🛒 Schema para adicionar item ao carrinho
export const addToCartSchema = Joi.object({
  produto_id: Joi.number().integer().positive().required().messages({
    'number.base': 'ID do produto deve ser um número',
    'number.integer': 'ID do produto deve ser um número inteiro',
    'number.positive': 'ID do produto deve ser positivo',
    'any.required': 'ID do produto é obrigatório'
  }),
  quantidade: Joi.number().integer().positive().max(99).required().messages({
    'number.base': 'Quantidade deve ser um número',
    'number.integer': 'Quantidade deve ser um número inteiro',
    'number.positive': 'Quantidade deve ser positiva',
    'number.max': 'Quantidade máxima é 99',
    'any.required': 'Quantidade é obrigatória'
  })
});

// 🔄 Schema para atualizar quantidade
export const updateCartItemSchema = Joi.object({
  quantidade: Joi.number().integer().min(0).max(99).required().messages({
    'number.base': 'Quantidade deve ser um número',
    'number.integer': 'Quantidade deve ser um número inteiro',
    'number.min': 'Quantidade deve ser 0 ou maior (0 = remover)',
    'number.max': 'Quantidade máxima é 99',
    'any.required': 'Quantidade é obrigatória'
  })
});

// 💳 Schema para finalizar compra - Formato robusto
export const checkoutSchema = Joi.object({
  // Endereço de entrega detalhado
  shipping_address: Joi.object({
    cep: Joi.string().pattern(/^\d{5}-?\d{3}$/).required().messages({
      'string.pattern.base': 'CEP deve estar no formato 12345-678 ou 12345678',
      'any.required': 'CEP é obrigatório'
    }),
    street: Joi.string().min(5).max(255).required().messages({
      'string.min': 'Rua deve ter pelo menos 5 caracteres',
      'string.max': 'Rua deve ter no máximo 255 caracteres',
      'any.required': 'Rua é obrigatória'
    }),
    number: Joi.string().max(20).required().messages({
      'string.max': 'Número deve ter no máximo 20 caracteres',
      'any.required': 'Número é obrigatório'
    }),
    complement: Joi.string().max(100).optional().allow('').messages({
      'string.max': 'Complemento deve ter no máximo 100 caracteres'
    }),
    neighborhood: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Bairro deve ter pelo menos 2 caracteres',
      'string.max': 'Bairro deve ter no máximo 100 caracteres',
      'any.required': 'Bairro é obrigatório'
    }),
    city: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Cidade deve ter pelo menos 2 caracteres',
      'string.max': 'Cidade deve ter no máximo 100 caracteres',
      'any.required': 'Cidade é obrigatória'
    }),
    state: Joi.string().length(2).uppercase().required().messages({
      'string.length': 'Estado deve ter exatamente 2 caracteres',
      'any.required': 'Estado é obrigatório'
    })
  }).required().messages({
    'any.required': 'Endereço de entrega é obrigatório'
  }),

  // Método de pagamento
  payment_method: Joi.string().valid('credit_card', 'debit_card', 'pix', 'boleto').required().messages({
    'any.only': 'Método de pagamento deve ser: credit_card, debit_card, pix ou boleto',
    'any.required': 'Método de pagamento é obrigatório'
  }),

  // Cupom de desconto (opcional)
  coupon: Joi.string().min(3).max(50).optional().messages({
    'string.min': 'Cupom deve ter pelo menos 3 caracteres',
    'string.max': 'Cupom deve ter no máximo 50 caracteres'
  }),

  // Observações (opcional)
  observacoes: Joi.string().max(300).optional().allow('').messages({
    'string.max': 'Observações devem ter no máximo 300 caracteres'
  })
});