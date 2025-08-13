
import db from "../../config/knexConfig.js";

export const findUserByEmail = async (email) => {
  return await db("usuarios").where({ email }).first();
};

export const createUser = async (userData) => {
  return await db("usuarios").insert(userData);
};

export const findUserById = async (id) => {
  return await db("usuarios").where({ id }).first();
};

export const updateUserPassword = async (id, newPassword) => {
  return await db("usuarios").where({ id }).update({ senha: newPassword });
};

export const updateUserResetToken = async (email, resetToken, resetTokenExpiry) => {
  return await db("usuarios")
    .where({ email })
    .update({ 
      token_recuperacao: resetToken, 
      token_recuperacao_expira_em: resetTokenExpiry 
    });
};

export const findUserByResetToken = async (resetToken) => {
  return await db("usuarios")
    .where({ token_recuperacao: resetToken })
    .andWhere('token_recuperacao_expira_em', '>', new Date())
    .first();
};

export const clearResetToken = async (id) => {
  return await db("usuarios")
    .where({ id })
    .update({ 
      token_recuperacao: null, 
      token_recuperacao_expira_em: null 
    });
};
