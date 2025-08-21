import { 
  listOrdersSchema, 
  updateOrderStatusSchema, 
  orderReportsSchema,
  searchOrdersSchema 
} from './orderSchema.js';
import { 
  getOrdersByUser, 
  getOrderById, 
  getOrderByIdAdmin,
  updateOrderStatus,
  getAllOrders,
  getOrderStats 
} from './orderModel.js';
import { NotificationModel } from '../notification/notificationModel.js';
import db from '../../db.js';

// 📋 Listar pedidos do cliente
export const listUserOrders = async (req, res) => {
  try {
    const { error, value } = listOrdersSchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        error: 'Filtros inválidos',
        details: error.details[0].message
      });
    }

    const usuario_id = req.user.id;
    const result = await getOrdersByUser(usuario_id, value);

    console.log(`📋 ${result.pedidos.length} pedidos listados para usuário ${usuario_id}`);

    res.json({
      message: 'Pedidos listados com sucesso',
      ...result
    });

  } catch (error) {
    console.error('❌ Erro ao listar pedidos:', error);
    res.status(500).json({
      error: 'Erro ao listar pedidos',
      message: error.message
    });
  }
};

// 🔍 Buscar pedido específico do cliente
export const getUserOrder = async (req, res) => {
  try {
    const pedido_id = parseInt(req.params.id);
    const usuario_id = req.user.id;

    if (!pedido_id) {
      return res.status(400).json({
        error: 'ID do pedido inválido'
      });
    }

    const pedido = await getOrderById(pedido_id, usuario_id);

    console.log(`🔍 Pedido #${pedido_id} visualizado pelo usuário ${usuario_id}`);

    res.json({
      message: 'Pedido encontrado',
      pedido
    });

  } catch (error) {
    console.error('❌ Erro ao buscar pedido:', error);
    
    if (error.message.includes('não encontrado')) {
      return res.status(404).json({
        error: 'Pedido não encontrado'
      });
    }

    res.status(500).json({
      error: 'Erro ao buscar pedido',
      message: error.message
    });
  }
};

// 🔄 Atualizar status do pedido (Admin)
export const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { error, value } = updateOrderStatusSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: error.details[0].message
      });
    }

    const pedido_id = parseInt(req.params.id);
    if (!pedido_id) {
      return res.status(400).json({
        error: 'ID do pedido inválido'
      });
    }

    const { status, observacoes_admin } = value;
    
    // Buscar pedido atual para obter o status anterior e usuario_id (Admin)
    const pedidoAtual = await getOrderByIdAdmin(pedido_id);
    const statusAntigo = pedidoAtual.status;
    const usuario_id = pedidoAtual.usuario_id;
    
    const pedidoAtualizado = await updateOrderStatus(pedido_id, status, observacoes_admin);

    // 📩 Criar notificação de mudança de status (apenas se o status mudou)
    if (statusAntigo !== status) {
      try {
        await NotificationModel.createStatusChangeNotification(
          usuario_id, 
          pedido_id, 
          statusAntigo, 
          status
        );
        console.log(`📩 Notificação de mudança de status criada para usuário ${usuario_id}`);
      } catch (notificationError) {
        console.error('⚠️ Erro ao criar notificação (não crítico):', notificationError.message);
        // Não falha a atualização se a notificação falhar
      }
    }

    console.log(`🔄 Status do pedido #${pedido_id} atualizado para "${status}" pelo admin ${req.user.id}`);

    res.json({
      message: 'Status do pedido atualizado com sucesso',
      pedido: pedidoAtualizado
    });

  } catch (error) {
    console.error('❌ Erro ao atualizar status:', error);
    
    if (error.message.includes('não encontrado')) {
      return res.status(404).json({
        error: 'Pedido não encontrado'
      });
    }

    res.status(500).json({
      error: 'Erro ao atualizar status',
      message: error.message
    });
  }
};

// 📊 Listar todos os pedidos (Admin)
export const listAllOrders = async (req, res) => {
  try {
    const { error, value } = searchOrdersSchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        error: 'Filtros inválidos',
        details: error.details[0].message
      });
    }

    const result = await getAllOrders(value);

    console.log(`📊 ${result.pedidos.length} pedidos listados pelo admin ${req.user.id}`);

    res.json({
      message: 'Pedidos listados com sucesso',
      ...result
    });

  } catch (error) {
    console.error('❌ Erro ao listar pedidos (admin):', error);
    res.status(500).json({
      error: 'Erro ao listar pedidos',
      message: error.message
    });
  }
};

// 📈 Relatórios e estatísticas (Admin)
export const getOrderReports = async (req, res) => {
  try {
    const { error, value } = orderReportsSchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        error: 'Parâmetros inválidos',
        details: error.details[0].message
      });
    }

    const stats = await getOrderStats(value);

    console.log(`📈 Relatório de pedidos gerado pelo admin ${req.user.id} (período: ${value.periodo})`);

    res.json({
      message: 'Relatório gerado com sucesso',
      relatorio: stats
    });

  } catch (error) {
    console.error('❌ Erro ao gerar relatório:', error);
    res.status(500).json({
      error: 'Erro ao gerar relatório',
      message: error.message
    });
  }
};

// 🔍 Buscar pedido específico (Admin)
export const getOrderDetailsAdmin = async (req, res) => {
  try {
    const pedido_id = parseInt(req.params.id);
    if (!pedido_id) {
      return res.status(400).json({
        error: 'ID do pedido inválido'
      });
    }

    // Admin pode ver qualquer pedido, então não passa usuario_id
    const pedido = await db('pedidos')
      .join('usuarios as u', 'pedidos.usuario_id', 'u.id')
      .select(
        'pedidos.*',
        'u.nome as usuario_nome',
        'u.email as usuario_email',
        'u.telefone as usuario_telefone'
      )
      .where('pedidos.id', pedido_id)
      .first();

    if (!pedido) {
      return res.status(404).json({
        error: 'Pedido não encontrado'
      });
    }

    // Buscar itens do pedido
    const itens = await db('pedido_itens as pi')
      .join('produtos as p', 'pi.produto_id', 'p.id')
      .select(
        'pi.id',
        'pi.produto_id',
        'pi.quantidade', 
        'pi.preco_unitario',
        'p.nome',
        'p.descricao',
        'p.imagem',
        db.raw('(pi.quantidade * pi.preco_unitario) as subtotal')
      )
      .where('pi.pedido_id', pedido_id);

    pedido.itens = itens;
    pedido.total_itens = itens.reduce((sum, item) => sum + item.quantidade, 0);

    console.log(`🔍 Pedido #${pedido_id} visualizado pelo admin ${req.user.id}`);

    res.json({
      message: 'Pedido encontrado',
      pedido
    });

  } catch (error) {
    console.error('❌ Erro ao buscar pedido (admin):', error);
    res.status(500).json({
      error: 'Erro ao buscar pedido',
      message: error.message
    });
  }
};
