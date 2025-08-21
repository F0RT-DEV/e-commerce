import { ReviewModel } from './reviewModel.js';
import { createReviewSchema, updateReviewSchema, reviewQuerySchema } from './reviewSchema.js';
import db from '../../db.js';

export class ReviewController {
  // ⭐ Criar uma nova avaliação
  static async createReview(req, res) {
    try {
      const { produto_id } = req.params;
      const usuario_id = req.user.id;

      console.log(`📝 Tentativa de criar avaliação para produto ${produto_id} por usuário ${usuario_id}`);

      // Validar dados de entrada
      const { error, value } = createReviewSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.details.map(detail => detail.message)
        });
      }

      // Verificar se o produto existe
      const produto = await db('produtos').where('id', produto_id).first();
      if (!produto) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }

      // Verificar se o usuário comprou o produto
      const hasPurchased = await ReviewModel.hasUserPurchasedProduct(usuario_id, produto_id);
      if (!hasPurchased) {
        return res.status(403).json({
          success: false,
          message: 'Você só pode avaliar produtos que já comprou e que tenham status "enviado" ou "entregue"'
        });
      }

      // Criar avaliação
      const reviewData = {
        produto_id: parseInt(produto_id),
        usuario_id,
        ...value
      };

      const review = await ReviewModel.create(reviewData);

      res.status(201).json({
        success: true,
        message: 'Avaliação criada com sucesso',
        data: {
          review
        }
      });

    } catch (error) {
      console.error('❌ Erro ao criar avaliação:', error);
      
      if (error.message === 'Você já avaliou este produto') {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // 📋 Listar avaliações de um produto
  static async getProductReviews(req, res) {
    try {
      const { produto_id } = req.params;

      console.log(`📋 Listando avaliações do produto ${produto_id}`);

      // Validar query parameters
      const { error, value } = reviewQuerySchema.validate(req.query);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Parâmetros inválidos',
          errors: error.details.map(detail => detail.message)
        });
      }

      // Verificar se o produto existe
      const produto = await db('produtos').where('id', produto_id).first();
      if (!produto) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }

      // Buscar avaliações
      const result = await ReviewModel.findByProduct(produto_id, value);

      // Buscar estatísticas
      const stats = await ReviewModel.getProductStats(produto_id);

      res.json({
        success: true,
        message: 'Avaliações listadas com sucesso',
        data: {
          produto: {
            id: produto.id,
            nome: produto.nome
          },
          stats,
          ...result
        }
      });

    } catch (error) {
      console.error('❌ Erro ao listar avaliações:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // 📊 Estatísticas de avaliações de um produto
  static async getProductReviewStats(req, res) {
    try {
      const { produto_id } = req.params;

      console.log(`📊 Buscando estatísticas de avaliações do produto ${produto_id}`);

      // Verificar se o produto existe
      const produto = await db('produtos').where('id', produto_id).first();
      if (!produto) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }

      // Buscar estatísticas
      const stats = await ReviewModel.getProductStats(produto_id);

      res.json({
        success: true,
        message: 'Estatísticas obtidas com sucesso',
        data: {
          produto: {
            id: produto.id,
            nome: produto.nome
          },
          stats
        }
      });

    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // 👤 Listar avaliações do usuário
  static async getUserReviews(req, res) {
    try {
      const usuario_id = req.user.id;

      console.log(`👤 Listando avaliações do usuário ${usuario_id}`);

      // Validar query parameters
      const { error, value } = reviewQuerySchema.validate(req.query);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Parâmetros inválidos',
          errors: error.details.map(detail => detail.message)
        });
      }

      // Buscar avaliações do usuário
      const result = await ReviewModel.findByUser(usuario_id, value);

      res.json({
        success: true,
        message: 'Suas avaliações listadas com sucesso',
        data: result
      });

    } catch (error) {
      console.error('❌ Erro ao listar avaliações do usuário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // 🔍 Buscar avaliação específica
  static async getReview(req, res) {
    try {
      const { id } = req.params;

      console.log(`🔍 Buscando avaliação ${id}`);

      const review = await ReviewModel.findById(id);

      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Avaliação não encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Avaliação encontrada',
        data: {
          review
        }
      });

    } catch (error) {
      console.error('❌ Erro ao buscar avaliação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // ✏️ Atualizar avaliação
  static async updateReview(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = req.user.id;

      console.log(`✏️ Tentativa de atualizar avaliação ${id} por usuário ${usuario_id}`);

      // Validar dados de entrada
      const { error, value } = updateReviewSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.details.map(detail => detail.message)
        });
      }

      // Atualizar avaliação
      const review = await ReviewModel.update(id, usuario_id, value);

      res.json({
        success: true,
        message: 'Avaliação atualizada com sucesso',
        data: {
          review
        }
      });

    } catch (error) {
      console.error('❌ Erro ao atualizar avaliação:', error);

      if (error.message === 'Avaliação não encontrada ou não pertence ao usuário') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // 🗑️ Deletar avaliação
  static async deleteReview(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = req.user.id;

      console.log(`🗑️ Tentativa de deletar avaliação ${id} por usuário ${usuario_id}`);

      // Deletar avaliação
      const result = await ReviewModel.delete(id, usuario_id);

      res.json({
        success: true,
        message: result.message
      });

    } catch (error) {
      console.error('❌ Erro ao deletar avaliação:', error);

      if (error.message === 'Avaliação não encontrada ou não pertence ao usuário') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}