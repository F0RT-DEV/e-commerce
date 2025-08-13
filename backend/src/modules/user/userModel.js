import db from "../../config/knexConfig.js";

// Buscar usuário por ID (sem dados sensíveis)
export const findUserById = async (id) => {
  return await db("usuarios")
    .select('id', 'nome', 'email', 'telefone', 'endereco', 'tipo', 'criado_em')
    .where({ id })
    .first();
};

// Buscar usuário completo (com senha para validações)
export const findUserByIdComplete = async (id) => {
  return await db("usuarios")
    .where({ id })
    .first();
};

// Atualizar perfil do usuário
export const updateUserProfile = async (id, userData) => {
  return await db("usuarios")
    .where({ id })
    .update({
      ...userData
    });
};

// Atualizar senha do usuário
export const updateUserPassword = async (id, newPasswordHash) => {
  return await db("usuarios")
    .where({ id })
    .update({
      senha: newPasswordHash
    });
};

// Atualizar email do usuário
export const updateUserEmail = async (id, newEmail) => {
  return await db("usuarios")
    .where({ id })
    .update({
      email: newEmail
    });
};

// Verificar se email já existe (para outro usuário)
export const findUserByEmailExcluding = async (email, excludeId) => {
  return await db("usuarios")
    .where({ email })
    .andWhere('id', '!=', excludeId)
    .first();
};

// Soft delete ou hard delete da conta
export const deleteUserAccount = async (id) => {
  // Opção 1: Hard delete (remove completamente)
  return await db("usuarios")
    .where({ id })
    .del();
  
  // Opção 2: Soft delete (marca como inativo) - descomente se preferir
  // return await db("usuarios")
  //   .where({ id })
  //   .update({
  //     ativo: false,
  //     deletado_em: new Date()
  //   });
};

// Verificar se usuário existe e está ativo
export const userExists = async (id) => {
  const user = await db("usuarios")
    .select('id')
    .where({ id })
    .first();
  return !!user;
};

// Buscar estatísticas do usuário (para dashboard)
export const getUserStats = async (id) => {
  // Aqui você pode agregar dados de outras tabelas quando implementar
  const stats = {
    usuario: await findUserById(id),
    // totalPedidos: await db("pedidos").where({ usuario_id: id }).count('id as total').first(),
    // totalAvaliacoes: await db("avaliacoes").where({ usuario_id: id }).count('id as total').first(),
    // ultimoLogin: await db("usuarios").select('ultimo_login').where({ id }).first()
  };
  
  return stats;
};
