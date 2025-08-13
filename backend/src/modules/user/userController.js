import bcrypt from "bcryptjs";
import { 
  updateProfileSchema, 
  updatePasswordSchema, 
  updateEmailSchema, 
  deleteAccountSchema 
} from "./userSchema.js";
import {
  findUserById,
  findUserByIdComplete,
  updateUserProfile,
  updateUserPassword,
  updateUserEmail,
  findUserByEmailExcluding,
  deleteUserAccount,
  getUserStats
} from "./userModel.js";

// GET /api/auth/me - Obter dados do usuário logado
export const getProfile = async (req, res) => {
  try {
    console.log('👤 Obtendo perfil do usuário ID:', req.user.id);
    
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    console.log('✅ Perfil obtido com sucesso:', user.email);
    res.json({ user });
  } catch (error) {
    console.error('❌ Erro ao obter perfil:', error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// PATCH /api/auth/me - Atualizar dados do usuário
export const updateProfile = async (req, res) => {
  try {
    console.log('📝 Atualizando perfil do usuário ID:', req.user.id);
    
    const { error } = updateProfileSchema.validate(req.body);
    if (error) {
      console.log('❌ Erro de validação:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    // Filtrar apenas campos permitidos
    const allowedFields = ['nome', 'telefone', 'endereco'];
    const updateData = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "Nenhum campo válido para atualizar." });
    }

    await updateUserProfile(req.user.id, updateData);
    
    // Buscar dados atualizados
    const updatedUser = await findUserById(req.user.id);
    
    console.log('✅ Perfil atualizado com sucesso:', updatedUser.email);
    res.json({ 
      message: "Perfil atualizado com sucesso!",
      user: updatedUser 
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar perfil:', error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// PATCH /api/auth/me/password - Atualizar senha
export const updatePassword = async (req, res) => {
  try {
    console.log('🔒 Atualizando senha do usuário ID:', req.user.id);
    
    const { error } = updatePasswordSchema.validate(req.body);
    if (error) {
      console.log('❌ Erro de validação:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    // Buscar usuário com senha atual
    const user = await findUserByIdComplete(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Verificar senha atual
    const isCurrentPasswordValid = await bcrypt.compare(req.body.senhaAtual, user.senha);
    if (!isCurrentPasswordValid) {
      console.log('⚠️  Senha atual incorreta para usuário:', user.email);
      return res.status(401).json({ error: "Senha atual incorreta." });
    }

    // Criptografar nova senha
    const hashedNewPassword = await bcrypt.hash(req.body.novaSenha, 10);
    
    // Atualizar no banco
    await updateUserPassword(req.user.id, hashedNewPassword);
    
    console.log('✅ Senha atualizada com sucesso para:', user.email);
    res.json({ message: "Senha atualizada com sucesso!" });
  } catch (error) {
    console.error('❌ Erro ao atualizar senha:', error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// PATCH /api/auth/me/email - Atualizar email
export const updateEmail = async (req, res) => {
  try {
    console.log('📧 Atualizando email do usuário ID:', req.user.id);
    
    const { error } = updateEmailSchema.validate(req.body);
    if (error) {
      console.log('❌ Erro de validação:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    // Verificar se novo email já está em uso
    const emailExists = await findUserByEmailExcluding(req.body.novoEmail, req.user.id);
    if (emailExists) {
      console.log('⚠️  Email já está em uso:', req.body.novoEmail);
      return res.status(409).json({ error: "Este e-mail já está em uso." });
    }

    // Buscar usuário para verificar senha
    const user = await findUserByIdComplete(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Verificar senha para confirmação
    const isPasswordValid = await bcrypt.compare(req.body.senha, user.senha);
    if (!isPasswordValid) {
      console.log('⚠️  Senha incorreta para alteração de email:', user.email);
      return res.status(401).json({ error: "Senha incorreta." });
    }

    // Atualizar email
    await updateUserEmail(req.user.id, req.body.novoEmail);
    
    console.log('✅ Email atualizado:', user.email, '->', req.body.novoEmail);
    res.json({ message: "E-mail atualizado com sucesso!" });
  } catch (error) {
    console.error('❌ Erro ao atualizar email:', error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// DELETE /api/auth/me - Deletar conta do usuário
export const deleteAccount = async (req, res) => {
  try {
    console.log('🗑️  Tentativa de exclusão de conta do usuário ID:', req.user.id);
    
    const { error } = deleteAccountSchema.validate(req.body);
    if (error) {
      console.log('❌ Erro de validação:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    // Buscar usuário para verificar senha
    const user = await findUserByIdComplete(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Verificar senha para confirmação
    const isPasswordValid = await bcrypt.compare(req.body.senha, user.senha);
    if (!isPasswordValid) {
      console.log('⚠️  Senha incorreta para exclusão de conta:', user.email);
      return res.status(401).json({ error: "Senha incorreta." });
    }

    // Deletar conta
    await deleteUserAccount(req.user.id);
    
    console.log('🗑️  Conta deletada com sucesso:', user.email);
    res.json({ message: "Conta deletada com sucesso!" });
  } catch (error) {
    console.error('❌ Erro ao deletar conta:', error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// GET /api/auth/me/stats - Obter estatísticas do usuário
export const getStats = async (req, res) => {
  try {
    console.log('📊 Obtendo estatísticas do usuário ID:', req.user.id);
    
    const stats = await getUserStats(req.user.id);
    
    console.log('✅ Estatísticas obtidas com sucesso');
    res.json(stats);
  } catch (error) {
    console.error('❌ Erro ao obter estatísticas:', error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export default {
  getProfile,
  updateProfile,
  updatePassword,
  updateEmail,
  deleteAccount,
  getStats
};
