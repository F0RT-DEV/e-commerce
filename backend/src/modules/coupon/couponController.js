import { CouponModel } from './couponModel.js';
import { calculateCartTotals } from '../cart/cartModel.js';
import { NotificationModel } from '../notification/notificationModel.js';
import {
  createCouponSchema,
  updateCouponSchema,
  applyCouponSchema,
  verifyCouponSchema,
  listCouponsSchema
} from './couponSchema.js';

export class CouponController {

  // Criar cupom (Admin)
  static async create(req, res) {
    try {
      const { error, value } = createCouponSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.details.map(detail => detail.message)
        });
      }

      const cupom = await CouponModel.create(value);

      res.status(201).json({
        success: true,
        message: 'Cupom criado com sucesso',
        data: {
          cupom
        }
      });

    } catch (error) {
      console.error('Erro ao criar cupom:', error);
      
      if (error.message === 'Código do cupom já existe') {
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

  // Listar cupons (Admin)
  static async list(req, res) {
    try {
      const { error, value } = listCouponsSchema.validate(req.query);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Parâmetros inválidos',
          errors: error.details.map(detail => detail.message)
        });
      }

      const result = await CouponModel.findAll(value);

      res.json({
        success: true,
        message: 'Cupons listados com sucesso',
        data: result
      });

    } catch (error) {
      console.error('Erro ao listar cupons:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Buscar cupom por ID (Admin)
  static async findById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID do cupom inválido'
        });
      }

      const cupom = await CouponModel.findById(parseInt(id));

      if (!cupom) {
        return res.status(404).json({
          success: false,
          message: 'Cupom não encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Cupom encontrado',
        data: {
          cupom
        }
      });

    } catch (error) {
      console.error('Erro ao buscar cupom:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Atualizar cupom (Admin)
  static async update(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID do cupom inválido'
        });
      }

      const { error, value } = updateCouponSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.details.map(detail => detail.message)
        });
      }

      const cupom = await CouponModel.update(parseInt(id), value);

      if (!cupom) {
        return res.status(404).json({
          success: false,
          message: 'Cupom não encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Cupom atualizado com sucesso',
        data: {
          cupom
        }
      });

    } catch (error) {
      console.error('Erro ao atualizar cupom:', error);
      
      if (error.message === 'Código do cupom já existe') {
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

  // Deletar cupom (Admin)
  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID do cupom inválido'
        });
      }

      const deleted = await CouponModel.delete(parseInt(id));

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Cupom não encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Cupom deletado com sucesso'
      });

    } catch (error) {
      console.error('Erro ao deletar cupom:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Verificar cupom (Público)
  static async verify(req, res) {
    try {
      const { error, value } = verifyCouponSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.details.map(detail => detail.message)
        });
      }

      const userId = req.user?.id || null;
      const validation = await CouponModel.validateCoupon(value.codigo, userId);

      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: validation.message
        });
      }

      res.json({
        success: true,
        message: validation.message,
        data: {
          cupom: {
            id: validation.cupom.id,
            codigo: validation.cupom.codigo,
            tipo: validation.cupom.tipo,
            valor: validation.cupom.valor,
            validade: validation.cupom.validade
          }
        }
      });

    } catch (error) {
      console.error('Erro ao verificar cupom:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Aplicar cupom ao carrinho
  static async applyToCart(req, res) {
    try {
      const { error, value } = applyCouponSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.details.map(detail => detail.message)
        });
      }

      const userId = req.user.id;
      
      // Verificar se carrinho existe
      if (!req.session.cart || req.session.cart.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Carrinho vazio'
        });
      }

      // Validar cupom
      const validation = await CouponModel.validateCoupon(value.codigo, userId);

      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: validation.message
        });
      }

      const cupom = validation.cupom;
      
      // Calcular totais atuais do carrinho
      const cartTotals = calculateCartTotals(req.session.cart);
      const totalCarrinho = cartTotals.subtotal;
      const desconto = CouponModel.calculateDiscount(cupom, totalCarrinho);
      const totalComDesconto = Math.max(0, totalCarrinho - desconto);

      // Aplicar cupom ao carrinho (armazenar em um objeto separado no session)
      if (!req.session.cart.cupom) {
        req.session.cart.cupom = {};
      }
      
      req.session.cart.cupom = {
        id: cupom.id,
        codigo: cupom.codigo,
        tipo: cupom.tipo,
        valor: cupom.valor,
        desconto: desconto
      };

      // Recalcular carrinho com o cupom aplicado
      const cartWithCoupon = calculateCartTotals(req.session.cart, req.session.cart.cupom);

      // 📩 Criar notificação de cupom aplicado
      try {
        await NotificationModel.createCouponUsedNotification(
          userId, 
          cupom.codigo, 
          desconto
        );
        console.log(`📩 Notificação de cupom aplicado criada para usuário ${userId}`);
      } catch (notificationError) {
        console.error('⚠️ Erro ao criar notificação (não crítico):', notificationError.message);
        // Não falha a aplicação do cupom se a notificação falhar
      }

      res.json({
        success: true,
        message: 'Cupom aplicado com sucesso',
        data: {
          cupom: {
            codigo: cupom.codigo,
            tipo: cupom.tipo,
            valor: cupom.valor,
            desconto: desconto
          },
          carrinho: cartWithCoupon
        }
      });

    } catch (error) {
      console.error('Erro ao aplicar cupom:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Remover cupom do carrinho
  static async removeFromCart(req, res) {
    try {
      if (!req.session.cart) {
        return res.status(400).json({
          success: false,
          message: 'Carrinho não encontrado'
        });
      }

      // Remover cupom do carrinho
      delete req.session.cart.cupom;

      // Recalcular carrinho sem cupom
      const cartWithoutCoupon = calculateCartTotals(req.session.cart);

      res.json({
        success: true,
        message: 'Cupom removido do carrinho',
        data: {
          carrinho: cartWithoutCoupon
        }
      });

    } catch (error) {
      console.error('Erro ao remover cupom:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Listar cupons ativos (Público)
  static async listActive(req, res) {
    try {
      const cupons = await CouponModel.findActiveCoupons();

      res.json({
        success: true,
        message: 'Cupons ativos listados com sucesso',
        data: {
          cupons
        }
      });

    } catch (error) {
      console.error('Erro ao listar cupons ativos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Estatísticas de cupons (Admin)
  static async getStats(req, res) {
    try {
      const stats = await CouponModel.getStats();

      res.json({
        success: true,
        message: 'Estatísticas obtidas com sucesso',
        data: {
          estatisticas: stats
        }
      });

    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}
