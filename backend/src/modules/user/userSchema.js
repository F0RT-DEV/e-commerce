import Joi from "joi";

// Schema para atualizar perfil
export const updateProfileSchema = Joi.object({
  nome: Joi.string().max(100).optional(),
  telefone: Joi.string().max(20).optional(),
  endereco: Joi.string().optional(),
  // Email e senha não são atualizáveis aqui (segurança)
});

// Schema para atualizar senha (requer senha atual)
export const updatePasswordSchema = Joi.object({
  senhaAtual: Joi.string().required(),
  novaSenha: Joi.string().min(6).required(),
  confirmarSenha: Joi.string().valid(Joi.ref('novaSenha')).required()
    .messages({
      'any.only': 'Confirmação de senha deve ser igual à nova senha'
    })
});

// Schema para atualizar email (requer senha para confirmação)
export const updateEmailSchema = Joi.object({
  novoEmail: Joi.string().email().required(),
  senha: Joi.string().required()
});

// Schema para deletar conta (requer confirmação)
export const deleteAccountSchema = Joi.object({
  senha: Joi.string().required(),
  confirmacao: Joi.string().valid('DELETE').required()
    .messages({
      'any.only': 'Digite "DELETE" para confirmar a exclusão da conta'
    })
});
