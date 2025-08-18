import { addToCartSchema, updateCartItemSchema, checkoutSchema } from './cartSchema.js';
import { getProductForCart, checkProductStock, createOrderFromCart, calculateCartTotals } from './cartModel.js';
import { NotificationModel } from '../notification/notificationModel.js';

// 🛒 CARRINHO EM SESSÃO (temporário)
// Cada usuário tem um carrinho em memória que persiste durante a sessão

// 📦 Adicionar produto ao carrinho
export const addToCart = async (req, res) => {
  try {
    const { error, value } = addToCartSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.details[0].message
      });
    }

    const { produto_id, quantidade } = value;
    const usuario_id = req.user.id;

    // Verificar se produto existe e tem estoque
    const produto = await getProductForCart(produto_id);
    await checkProductStock(produto_id, quantidade);

    // Inicializar carrinho na sessão se não existir
    if (!req.session.cart) {
      req.session.cart = [];
    }

    // Verificar se produto já está no carrinho
    const existingItemIndex = req.session.cart.findIndex(
      item => item.produto_id === produto_id
    );

    if (existingItemIndex !== -1) {
      // Atualizar quantidade do item existente
      const novaQuantidade = req.session.cart[existingItemIndex].quantidade + quantidade;
      await checkProductStock(produto_id, novaQuantidade);
      
      req.session.cart[existingItemIndex].quantidade = novaQuantidade;
    } else {
      // Adicionar novo item ao carrinho
      req.session.cart.push({
        produto_id: produto.id,
        nome: produto.nome,
        preco: parseFloat(produto.preco),
        quantidade,
        imagem: produto.imagem
      });
    }

    // Calcular totais
    const cartWithTotals = calculateCartTotals(req.session.cart);

    console.log(`🛒 Produto adicionado ao carrinho: ${produto.nome} (${quantidade}x)`);

    res.json({
      message: 'Produto adicionado ao carrinho',
      produto: produto.nome,
      quantidade,
      carrinho: cartWithTotals
    });

  } catch (error) {
    console.error('❌ Erro ao adicionar ao carrinho:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

// 👀 Visualizar carrinho
export const getCart = async (req, res) => {
  try {
    const cart = req.session.cart || [];
    
    // Incluir informações de cupom se houver
    const cupomInfo = req.session.cart?.cupom || null;
    const cartWithTotals = calculateCartTotals(cart, cupomInfo);

    console.log(`👀 Carrinho visualizado: ${cartWithTotals.total_itens} itens`);

    res.json({
      carrinho: cartWithTotals,
      isEmpty: cart.length === 0
    });

  } catch (error) {
    console.error('❌ Erro ao buscar carrinho:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};

// 🔄 Atualizar quantidade de item no carrinho
export const updateCartItem = async (req, res) => {
  try {
    const { error, value } = updateCartItemSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.details[0].message
      });
    }

    const { quantidade } = value;
    const produto_id = parseInt(req.params.produto_id);

    if (!req.session.cart) {
      return res.status(404).json({
        error: 'Carrinho vazio'
      });
    }

    const itemIndex = req.session.cart.findIndex(
      item => item.produto_id === produto_id
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        error: 'Produto não encontrado no carrinho'
      });
    }

    // Se quantidade for 0, remover item
    if (quantidade === 0) {
      const removedItem = req.session.cart.splice(itemIndex, 1)[0];
      console.log(`🗑️ Item removido do carrinho: ${removedItem.nome}`);

      const cartWithTotals = calculateCartTotals(req.session.cart);

      return res.json({
        message: 'Item removido do carrinho',
        produto: removedItem.nome,
        carrinho: cartWithTotals
      });
    }

    // Verificar estoque para nova quantidade
    await checkProductStock(produto_id, quantidade);

    // Atualizar quantidade
    req.session.cart[itemIndex].quantidade = quantidade;

    const cartWithTotals = calculateCartTotals(req.session.cart);

    console.log(`🔄 Quantidade atualizada: ${req.session.cart[itemIndex].nome} (${quantidade}x)`);

    res.json({
      message: 'Quantidade atualizada',
      produto: req.session.cart[itemIndex].nome,
      nova_quantidade: quantidade,
      carrinho: cartWithTotals
    });

  } catch (error) {
    console.error('❌ Erro ao atualizar carrinho:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

// 🗑️ Remover item do carrinho
export const removeFromCart = async (req, res) => {
  try {
    const produto_id = parseInt(req.params.produto_id);

    if (!req.session.cart) {
      return res.status(404).json({
        error: 'Carrinho vazio'
      });
    }

    const itemIndex = req.session.cart.findIndex(
      item => item.produto_id === produto_id
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        error: 'Produto não encontrado no carrinho'
      });
    }

    const removedItem = req.session.cart.splice(itemIndex, 1)[0];
    const cartWithTotals = calculateCartTotals(req.session.cart);

    console.log(`🗑️ Item removido do carrinho: ${removedItem.nome}`);

    res.json({
      message: 'Item removido do carrinho',
      produto: removedItem.nome,
      carrinho: cartWithTotals
    });

  } catch (error) {
    console.error('❌ Erro ao remover do carrinho:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};

// 🧹 Limpar carrinho
export const clearCart = async (req, res) => {
  try {
    req.session.cart = [];

    console.log('🧹 Carrinho limpo');

    res.json({
      message: 'Carrinho limpo com sucesso'
    });

  } catch (error) {
    console.error('❌ Erro ao limpar carrinho:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};

// 💳 Finalizar compra (converter carrinho em pedido) - Formato robusto
export const checkout = async (req, res) => {
  try {
    const { error, value } = checkoutSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.details[0].message
      });
    }

    const usuario_id = req.user.id;
    const cart = req.session.cart || [];

    if (cart.length === 0) {
      return res.status(400).json({
        error: 'Carrinho vazio'
      });
    }

    // Converter carrinho em pedido com dados completos
    const pedidoResult = await createOrderFromCart(usuario_id, cart, value);

    // 📩 Criar notificação de pedido confirmado
    try {
      await NotificationModel.createOrderNotification(
        usuario_id, 
        pedidoResult.pedido_id, 
        pedidoResult.total
      );
      console.log(`📩 Notificação de pedido criada para usuário ${usuario_id}`);
    } catch (notificationError) {
      console.error('⚠️ Erro ao criar notificação (não crítico):', notificationError.message);
      // Não falha o checkout se a notificação falhar
    }

    // Limpar carrinho após compra
    req.session.cart = [];

    console.log(`💳 Compra finalizada! Pedido #${pedidoResult.pedido_id} criado para usuário ${usuario_id}`);
    console.log(`💰 Total: R$ ${pedidoResult.total.toFixed(2)} (Subtotal: R$ ${pedidoResult.subtotal.toFixed(2)}, Frete: R$ ${pedidoResult.valor_frete.toFixed(2)}, Desconto: R$ ${pedidoResult.valor_desconto.toFixed(2)})`);
    console.log(`📍 Entrega: ${pedidoResult.endereco.rua}, ${pedidoResult.endereco.numero} - ${pedidoResult.endereco.bairro}, ${pedidoResult.endereco.cidade}/${pedidoResult.endereco.estado}`);

    res.json({
      message: 'Compra finalizada com sucesso',
      pedido: {
        id: pedidoResult.pedido_id,
        status: 'pendente',
        subtotal: pedidoResult.subtotal,
        valor_frete: pedidoResult.valor_frete,
        valor_desconto: pedidoResult.valor_desconto,
        total: pedidoResult.total,
        metodo_pagamento: value.payment_method,
        endereco_entrega: {
          cep: pedidoResult.endereco.cep,
          rua: pedidoResult.endereco.rua,
          numero: pedidoResult.endereco.numero,
          complemento: pedidoResult.endereco.complemento,
          bairro: pedidoResult.endereco.bairro,
          cidade: pedidoResult.endereco.cidade,
          estado: pedidoResult.endereco.estado
        },
        cupom_usado: value.coupon || null,
        observacoes: value.observacoes || null
      }
    });

  } catch (error) {
    console.error('❌ Erro no checkout:', error);
    res.status(500).json({
      error: 'Erro ao finalizar compra',
      message: error.message
    });
  }
};