import db from '../../db.js';

// 🛒 CARRINHO TEMPORÁRIO (em memória, não no banco)
// Quando finalizar compra, vira pedido nas tabelas: pedidos + pedido_itens

// 📦 Buscar detalhes do produto para adicionar ao carrinho
export const getProductForCart = async (produto_id) => {
  const produto = await db('produtos')
    .select('id', 'nome', 'preco', 'estoque', 'imagem')
    .where({ id: produto_id })
    .first();

  if (!produto) {
    throw new Error('Produto não encontrado');
  }

  if (produto.estoque <= 0) {
    throw new Error('Produto fora de estoque');
  }

  return produto;
};

// ✅ Verificar se há estoque suficiente
export const checkProductStock = async (produto_id, quantidade) => {
  const produto = await db('produtos')
    .select('estoque', 'nome')
    .where({ id: produto_id })
    .first();

  if (!produto) {
    throw new Error('Produto não encontrado');
  }

  if (produto.estoque < quantidade) {
    throw new Error(`Estoque insuficiente. Disponível: ${produto.estoque} unidades de ${produto.nome}`);
  }

  return true;
};

// 💳 Criar pedido a partir do carrinho (finalizar compra) - Formato robusto
export const createOrderFromCart = async (usuario_id, cartItems, checkoutData) => {
  const trx = await db.transaction();

  try {
    // 1. Calcular subtotal dos produtos
    let subtotal = 0;
    const orderItems = [];

    // 2. Validar estoque e preparar itens
    for (const item of cartItems) {
      await checkProductStock(item.produto_id, item.quantidade);
      
      const produto = await trx('produtos')
        .select('preco', 'nome')
        .where({ id: item.produto_id })
        .first();

      const itemSubtotal = produto.preco * item.quantidade;
      subtotal += itemSubtotal;

      orderItems.push({
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        preco_unitario: produto.preco
      });
    }

    // 3. Processar cupom de desconto (se fornecido)
    let valor_desconto = 0;
    if (checkoutData.coupon) {
      // TODO: Implementar lógica de cupons
      // Por enquanto, exemplo com 10% de desconto para cupons válidos
      if (checkoutData.coupon === 'DESCONTO10') {
        valor_desconto = subtotal * 0.1;
      }
    }

    // 4. Calcular frete (exemplo fixo por enquanto)
    const valor_frete = 15.00; // TODO: Implementar cálculo real de frete

    // 5. Calcular total final
    const total = subtotal + valor_frete - valor_desconto;

    // 6. Criar o pedido com dados completos
    const pedidoData = {
      usuario_id,
      subtotal: parseFloat(subtotal.toFixed(2)),
      valor_desconto: parseFloat(valor_desconto.toFixed(2)),
      valor_frete: parseFloat(valor_frete.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      status: 'pendente',
      
      // Endereço de entrega
      endereco_cep: checkoutData.shipping_address.cep.replace('-', ''),
      endereco_rua: checkoutData.shipping_address.street,
      endereco_numero: checkoutData.shipping_address.number,
      endereco_complemento: checkoutData.shipping_address.complement || null,
      endereco_bairro: checkoutData.shipping_address.neighborhood,
      endereco_cidade: checkoutData.shipping_address.city,
      endereco_estado: checkoutData.shipping_address.state.toUpperCase(),
      
      // Dados adicionais
      metodo_pagamento: checkoutData.payment_method,
      codigo_cupom: checkoutData.coupon || null,
      observacoes: checkoutData.observacoes || null,
      
      criado_em: new Date()
    };

    const [pedido_id] = await trx('pedidos').insert(pedidoData);

    // 7. Adicionar itens do pedido
    const pedidoItensData = orderItems.map(item => ({
      pedido_id,
      ...item
    }));

    await trx('pedido_itens').insert(pedidoItensData);

    // 8. Reduzir estoque dos produtos
    for (const item of cartItems) {
      await trx('produtos')
        .where({ id: item.produto_id })
        .decrement('estoque', item.quantidade);
    }

    await trx.commit();

    return {
      pedido_id,
      subtotal,
      valor_desconto,
      valor_frete,
      total,
      endereco: {
        cep: pedidoData.endereco_cep,
        rua: pedidoData.endereco_rua,
        numero: pedidoData.endereco_numero,
        complemento: pedidoData.endereco_complemento,
        bairro: pedidoData.endereco_bairro,
        cidade: pedidoData.endereco_cidade,
        estado: pedidoData.endereco_estado
      }
    };

  } catch (error) {
    await trx.rollback();
    throw error;
  }
};

// 📊 Calcular totais do carrinho
export const calculateCartTotals = (cartItems) => {
  let total = 0;
  let totalItens = 0;

  const itemsWithSubtotal = cartItems.map(item => {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;
    totalItens += item.quantidade;

    return {
      ...item,
      subtotal: parseFloat(subtotal.toFixed(2))
    };
  });

  return {
    itens: itemsWithSubtotal,
    total_itens: totalItens,
    total: parseFloat(total.toFixed(2))
  };
};