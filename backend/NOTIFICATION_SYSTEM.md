# 📩 Sistema de Notificações - E-commerce API

## 🎯 **Visão Geral**

O sistema de notificações permite enviar alertas automáticos para os usuários sobre:
- ✅ Confirmação de pedidos
- 📦 Mudanças de status de pedidos
- 🎟️ Aplicação de cupons
- 📢 Mensagens administrativas

## 🗄️ **Estrutura do Banco**

```sql
Table: notificacoes
- id (int, AUTO_INCREMENT, PRIMARY KEY)
- usuario_id (int, FOREIGN KEY → usuarios.id)
- titulo (varchar(100))
- mensagem (text)
- lida (tinyint(1), default: 0)
- criado_em (datetime)
```

## 🔄 **Fluxo Automático de Notificações**

### **1. 🛒 Checkout → Notificação de Pedido**
```
Usuário finaliza compra → Sistema cria pedido → Notificação automática:
"Pedido Confirmado! 🎉 Seu pedido #123 foi confirmado com sucesso! Total: R$ 299,90"
```

### **2. 📦 Admin Altera Status → Notificação de Status**
```
Admin muda status → Sistema detecta mudança → Notificação automática:
"Status do Pedido Atualizado - Seu pedido #123 foi enviado para entrega"
```

### **3. 🎟️ Aplicação de Cupom → Notificação de Desconto**
```
Usuário aplica cupom → Sistema valida → Notificação automática:
"Cupom Aplicado! 🎟️ Cupom 'DESCONTO10' aplicado! Você economizou R$ 29,99"
```

## 🌐 **Endpoints da API**

### **📋 Cliente - Gerenciar Notificações**

#### **GET /api/client/notifications**
Listar notificações do usuário com paginação e filtros.

**Query Parameters:**
```
?page=1&limit=20&lida=false&order=desc
```

**Filtros disponíveis:**
- `page`: Página atual (padrão: 1)
- `limit`: Itens por página (padrão: 20, máx: 100)
- `lida`: true/false para filtrar por status
- `order`: "asc" ou "desc" para ordenação

#### **GET /api/client/notifications/stats**
Estatísticas das notificações do usuário.

**Resposta:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total": 15,
      "lidas": 8,
      "nao_lidas": 7
    }
  }
}
```

#### **PATCH /api/client/notifications/:id/read**
Marcar notificação específica como lida.

#### **PATCH /api/client/notifications/read-all**
Marcar todas as notificações como lidas.

**Resposta:**
```json
{
  "success": true,
  "message": "5 notificações marcadas como lidas",
  "data": {
    "updated_count": 5
  }
}
```

#### **DELETE /api/client/notifications/:id**
Deletar notificação específica.

### **⚙️ Admin - Criar Notificações**

#### **POST /api/admin/notifications**
Criar notificação manual para um usuário.

**Body:**
```json
{
  "usuario_id": 1,
  "titulo": "Promoção Especial! 🔥",
  "mensagem": "Aproveite nossa mega promoção com até 50% de desconto!"
}
```

## 🔧 **Integração com Outros Módulos**

### **1. Carrinho (cartController.js)**
```javascript
// No checkout, após criar o pedido:
await NotificationModel.createOrderNotification(
  usuario_id, 
  pedido_id, 
  total
);
```

### **2. Pedidos (orderController.js)**
```javascript
// Ao atualizar status de pedido:
await NotificationModel.createStatusChangeNotification(
  usuario_id, 
  pedido_id, 
  statusAntigo, 
  statusNovo
);
```

### **3. Cupons (couponController.js)**
```javascript
// Ao aplicar cupom:
await NotificationModel.createCouponUsedNotification(
  usuario_id, 
  cupom_codigo, 
  desconto
);
```

## 📱 **Tipos de Notificações Automáticas**

### **🆕 Pedido Confirmado**
- **Trigger:** Checkout finalizado
- **Título:** "Pedido Confirmado! 🎉"
- **Mensagem:** Inclui número do pedido e valor total

### **📦 Status Alterado**
- **Trigger:** Admin altera status do pedido
- **Título:** "Status do Pedido Atualizado"
- **Mensagem:** Mostra mudança de status com emojis

### **🎟️ Cupom Aplicado**
- **Trigger:** Cupom aplicado no carrinho
- **Título:** "Cupom Aplicado! 🎟️"
- **Mensagem:** Mostra código e valor economizado

## 🛡️ **Validações e Segurança**

### **Validações de Input:**
- ✅ Título: máximo 100 caracteres
- ✅ Mensagem: obrigatória
- ✅ usuario_id: número inteiro positivo
- ✅ Paginação: página mínima 1, limite máximo 100

### **Segurança:**
- ✅ Usuários só veem suas próprias notificações
- ✅ Admin pode criar notificações para qualquer usuário
- ✅ Validação de autenticação em todas as rotas
- ✅ Controle de role para rotas administrativas

## 🔍 **Logs e Monitoramento**

O sistema registra logs para:
- ✅ Criação de notificações
- ✅ Marcação como lida
- ✅ Erros (não críticos para não quebrar fluxo principal)

**Exemplos de logs:**
```
📩 Notificação criada: Pedido Confirmado! para usuário 1
✅ Notificação 5 marcada como lida para usuário 1
⚠️ Erro ao criar notificação (não crítico): Database timeout
```

## 🚀 **Como Testar**

### **1. Testar Notificação Automática (Pedido):**
1. Adicione produto ao carrinho
2. Finalize a compra (checkout)
3. Verifique notificações: `GET /api/client/notifications`

### **2. Testar Mudança de Status:**
1. Como admin, altere status de um pedido
2. Como cliente, verifique novas notificações

### **3. Testar Cupom:**
1. Aplique um cupom válido no carrinho
2. Verifique notificações de cupom aplicado

### **4. Gerenciar Notificações:**
1. Liste suas notificações
2. Marque algumas como lidas
3. Delete notificações antigas
4. Verifique estatísticas

## 💡 **Funcionalidades Futuras**

- 📧 **Envio por E-mail:** Integração com serviços de e-mail
- 📱 **Push Notifications:** Para aplicativo mobile
- 🔔 **Notificações em Tempo Real:** WebSockets
- 📊 **Dashboard de Notificações:** Métricas para admin
- 🎯 **Notificações Segmentadas:** Por categoria de usuário
- ⏰ **Notificações Agendadas:** Envio em horário específico

## ✅ **Status de Implementação**

```
🟢 CONCLUÍDO:
- Sistema de notificações automáticas
- CRUD completo de notificações
- Integração com pedidos, cupons e carrinho
- Validações e segurança
- Paginação e filtros
- Logs e monitoramento

🟡 FUTURO:
- Envio por e-mail
- Push notifications
- WebSockets para tempo real
```

O sistema de notificações está **100% funcional** e integrado! 🎉
