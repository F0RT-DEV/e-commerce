
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "./authSchema.js";
import { 
  createUser, 
  findUserByEmail, 
  findUserById, 
  updateUserPassword, 
  updateUserResetToken, 
  findUserByResetToken, 
  clearResetToken 
} from "./authModel.js";

export const register = async (req, res) => {
  try {
    console.log('📝 Tentativa de registro:', { email: req.body.email, nome: req.body.nome });
    
    const { error } = registerSchema.validate(req.body);
    if (error) {
      console.log('❌ Erro de validação:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    const userExists = await findUserByEmail(req.body.email);
    if (userExists) {
      console.log('⚠️  E-mail já cadastrado:', req.body.email);
      return res.status(409).json({ error: "E-mail já cadastrado." });
    }

    const hashedPassword = await bcrypt.hash(req.body.senha, 10);
    const user = {
      ...req.body,
      senha: hashedPassword,
      criado_em: new Date()
    };

    await createUser(user);
    console.log('✅ Usuário criado com sucesso:', req.body.email);
    res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    console.error('❌ Erro no registro:', error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const login = async (req, res) => {
  try {
    console.log('🔑 Tentativa de login:', req.body.email);
    
    const { error } = loginSchema.validate(req.body);
    if (error) {
      console.log('❌ Erro de validação no login:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await findUserByEmail(req.body.email);
    if (!user) {
      console.log('⚠️  Usuário não encontrado:', req.body.email);
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const isPasswordValid = await bcrypt.compare(req.body.senha, user.senha);
    if (!isPasswordValid) {
      console.log('⚠️  Senha incorreta para:', req.body.email);
      return res.status(401).json({ error: "Senha incorreta." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.tipo, nome: user.nome },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log('✅ Login realizado com sucesso:', req.body.email);
    res.json({ token });
  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { error } = forgotPasswordSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await findUserByEmail(req.body.email);
    if (!user) {
      // Por segurança, não revelar se o e-mail existe ou não
      return res.json({ message: "Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha." });
    }

    // Gerar token de recuperação
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    await updateUserResetToken(req.body.email, resetToken, resetTokenExpiry);

    // Em um ambiente de produção, você enviaria este token por e-mail
    // Por enquanto, vamos retornar na resposta para teste
    res.json({ 
      message: "Token de recuperação gerado com sucesso.",
      resetToken: resetToken, // REMOVER EM PRODUÇÃO
      expiresIn: "1 hora"
    });
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await findUserByResetToken(req.body.token);
    if (!user) {
      return res.status(400).json({ error: "Token inválido ou expirado." });
    }

    const hashedPassword = await bcrypt.hash(req.body.novaSenha, 10);
    await updateUserPassword(user.id, hashedPassword);
    await clearResetToken(user.id);

    res.json({ message: "Senha redefinida com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export default {
  register,
  login,
  forgotPassword,
  resetPassword
};
