
import Joi from "joi";

export const registerSchema = Joi.object({
  nome: Joi.string().max(100).required(),
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required(),
  telefone: Joi.string().max(20),
  endereco: Joi.string(),
  tipo: Joi.string().valid("cliente", "admin").required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  senha: Joi.string().required()
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  novaSenha: Joi.string().min(6).required()
});
