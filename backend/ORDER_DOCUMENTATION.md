# 📦 Sistema de Pedidos (Orders) - Documentação

## 📋 **Visão Geral**

O módulo de pedidos gerencia todo o ciclo de vida dos pedidos, desde a criação (via checkout do carrinho) até a entrega final. Inclui funcionalidades para clientes visualizarem seus pedidos e para admins gerenciarem o status e relatórios.

## 🎯 **Funcionalidades Implementadas**

### **👤 Cliente**
- ✅ Listar seus pedidos (com filtros e paginação)
- ✅ Visualizar detalhes de um pedido específico
- ✅ Histórico completo de compras

### **👨‍💼 Admin**
- ✅ Listar todos os pedidos (com busca avançada)
- ✅ Visualizar detalhes de qualquer pedido
- ✅ Atualizar status dos pedidos
- ✅ Relatórios e estatísticas de vendas
- ✅ Dashboard de métricas

## 🌐 **Rotas Disponíveis**

### **📋 Cliente (`/api/client/orders`)**

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/` | Listar pedidos do cliente | ✅ Cliente |
| `GET` | `/:id` | Ver pedido específico | ✅ Cliente |

### **👨‍💼 Admin (`/api/admin/orders`)**

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/` | Listar todos os pedidos | ✅ Admin |
| `GET` | `/reports` | Relatórios e estatísticas | ✅ Admin |
| `GET` | `/:id` | Ver pedido específico (admin) | ✅ Admin |
| `PATCH` | `/:id/status` | Atualizar status do pedido | ✅ Admin |

## 📝 **Exemplos de Request/Response**

### **1. Listar Pedidos do Cliente**
```bash
GET {{clientURL}}/orders?page=1&limit=10&status=entregue
Authorization: Bearer {{authToken}}
```

**Response:**
```json
{
  "message": "Pedidos listados com sucesso",
  "pedidos": [
    {
      "id": 15,
      "usuario_id": 3,
      "subtotal": 208.80,
      "valor_desconto": 20.88,
      "valor_frete": 15.00,
      "total": 202.92,
      "status": "entregue",
      "metodo_pagamento": "credit_card",
      "codigo_cupom": "DESCONTO10",
      "endereco_cep": "12345678",
      "endereco_rua": "Rua das Flores",
      "endereco_numero": "123",
      "endereco_complemento": "Apto 202",
      "endereco_bairro": "Centro",
      "endereco_cidade": "São Paulo",
      "endereco_estado": "SP",
      "observacoes": "Entregar após 18h",
      "criado_em": "2025-08-14T20:30:00.000Z",
      "itens": [
        {
          "id": 25,
          "produto_id": 11,
          "quantidade": 2,
          "preco_unitario": 89.90,
          "nome": "iPhone 15 Pro",
          "imagem": "https://example.com/iphone.jpg"
        }
      ],
      "total_itens": 2
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "pages": 1
  }
}
```

### **2. Ver Pedido Específico**
```bash
GET {{clientURL}}/orders/15
Authorization: Bearer {{authToken}}
```

**Response:**
```json
{
  "message": "Pedido encontrado",
  "pedido": {
    "id": 15,
    "usuario_id": 3,
    "subtotal": 208.80,
    "valor_desconto": 20.88,
    "valor_frete": 15.00,
    "total": 202.92,
    "status": "entregue",
    "metodo_pagamento": "credit_card",
    "codigo_cupom": "DESCONTO10",
    "endereco_cep": "12345678",
    "endereco_rua": "Rua das Flores",
    "endereco_numero": "123",
    "endereco_complemento": "Apto 202",
    "endereco_bairro": "Centro",
    "endereco_cidade": "São Paulo",
    "endereco_estado": "SP",
    "observacoes": "Entregar após 18h",
    "criado_em": "2025-08-14T20:30:00.000Z",
    "itens": [
      {
        "id": 25,
        "produto_id": 11,
        "quantidade": 2,
        "preco_unitario": 89.90,
        "nome": "iPhone 15 Pro",
        "descricao": "O iPhone mais avançado",
        "imagem": "https://example.com/iphone.jpg",
        "subtotal": 179.80
      }
    ],
    "total_itens": 2
  }
}
```

### **3. Atualizar Status (Admin)**
```bash
PATCH {{adminURL}}/orders/15/status
Authorization: Bearer {{authToken}}
Content-Type: application/json

{
  "status": "enviado",
  "observacoes_admin": "Produto enviado via Correios - Código: BR123456789"
}
```

**Response:**
```json
{
  "message": "Status do pedido atualizado com sucesso",
  "pedido": {
    "id": 15,
    "status": "enviado",
    "atualizado_em": "2025-08-14T21:00:00.000Z"
  }
}
```

### **4. Listar Todos os Pedidos (Admin)**
```bash
GET {{adminURL}}/orders?page=1&limit=20&status=pendente&termo=joão
Authorization: Bearer {{authToken}}
```

**Response:**
```json
{
  "message": "Pedidos listados com sucesso",
  "pedidos": [
    {
      "id": 15,
      "usuario_id": 3,
      "usuario_nome": "João Silva",
      "usuario_email": "joao@email.com",
      "subtotal": 208.80,
      "valor_desconto": 20.88,
      "valor_frete": 15.00,
      "total": 202.92,
      "status": "pendente",
      "metodo_pagamento": "credit_card",
      "codigo_cupom": "DESCONTO10",
      "endereco_cidade": "São Paulo",
      "endereco_estado": "SP",
      "criado_em": "2025-08-14T20:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 145,
    "pages": 8
  }
}
```

### **5. Relatórios (Admin)**
```bash
GET {{adminURL}}/orders/reports?periodo=mes&status=entregue
Authorization: Bearer {{authToken}}
```

**Response:**
```json
{
  "message": "Relatório gerado com sucesso",
  "relatorio": {
    "periodo": {
      "inicio": "2025-08-01T00:00:00.000Z",
      "fim": "2025-08-31T23:59:59.999Z",
      "tipo": "mes"
    },
    "estatisticas": {
      "total_pedidos": 145,
      "receita_total": 25480.50,
      "ticket_medio": 175.73,
      "total_frete": 2175.00,
      "total_descontos": 1829.75
    },
    "distribuicao": {
      "por_status": [
        { "status": "entregue", "total": 89 },
        { "status": "enviado", "total": 23 },
        { "status": "processando", "total": 18 },
        { "status": "pendente", "total": 15 }
      ],
      "por_pagamento": [
        { "metodo_pagamento": "credit_card", "total": 78, "receita": 15820.30 },
        { "metodo_pagamento": "pix", "total": 45, "receita": 7654.20 },
        { "metodo_pagamento": "debit_card", "total": 22, "receita": 2006.00 }
      ]
    }
  }
}
```

## ⚙️ **Status dos Pedidos**

| Status | Descrição | Próximo Status |
|--------|-----------|----------------|
| `pendente` | Pedido criado, aguardando processamento | `processando` |
| `processando` | Pedido sendo preparado para envio | `enviado` |
| `enviado` | Pedido despachado para entrega | `entregue` |
| `entregue` | Pedido entregue ao cliente | - |
| `cancelado` | Pedido cancelado (qualquer momento) | - |

## 🔍 **Filtros Disponíveis**

### **Cliente:**
- `status` - Filtrar por status do pedido
- `page` - Página (padrão: 1)
- `limit` - Itens por página (padrão: 10, máx: 100)
- `data_inicio` - Data de início (formato: YYYY-MM-DD)
- `data_fim` - Data de fim (formato: YYYY-MM-DD)

### **Admin:**
- Todos os filtros do cliente +
- `termo` - Busca por nome/email do usuário ou ID do pedido
- `usuario_id` - Filtrar por usuário específico
- `metodo_pagamento` - Filtrar por método de pagamento
- `limit` padrão: 20 para admin

## 📊 **Relatórios (Admin)**

### **Períodos Disponíveis:**
- `dia` - Últimas 24 horas
- `semana` - Últimos 7 dias
- `mes` - Mês atual (padrão)
- `ano` - Ano atual
- Período customizado com `data_inicio` e `data_fim`

### **Métricas Incluídas:**
- Total de pedidos
- Receita total
- Ticket médio
- Total de frete coletado
- Total de descontos concedidos
- Distribuição por status
- Distribuição por método de pagamento

## 🔧 **Validações Implementadas**

### **Status:**
- ✅ Apenas valores válidos: pendente, processando, enviado, entregue, cancelado
- ✅ Observações do admin (opcional, máx. 500 caracteres)

### **Filtros:**
- ✅ Paginação (page >= 1, limit <= 100)
- ✅ Datas válidas (formato ISO)
- ✅ Termo de busca (1-100 caracteres)

### **Segurança:**
- ✅ Cliente só vê seus próprios pedidos
- ✅ Admin vê todos os pedidos
- ✅ Autenticação obrigatória
- ✅ Verificação de roles

## 🗃️ **Estrutura do Banco**

```sql
-- Tabela principal de pedidos
pedidos:
- id (PK)
- usuario_id (FK)
- subtotal, valor_desconto, valor_frete, total
- status (enum)
- endereco_* (campos completos)
- metodo_pagamento, codigo_cupom
- observacoes
- criado_em, atualizado_em

-- Itens dos pedidos
pedido_itens:
- id (PK)
- pedido_id (FK)
- produto_id (FK)
- quantidade, preco_unitario
```

## 🚀 **Como Testar**

### **1. Como Cliente:**
```bash
# Fazer login
POST /api/auth/login

# Listar meus pedidos
GET /api/client/orders

# Ver pedido específico
GET /api/client/orders/15
```

### **2. Como Admin:**
```bash
# Fazer login como admin
POST /api/auth/login

# Listar todos os pedidos
GET /api/admin/orders

# Gerar relatório mensal
GET /api/admin/orders/reports?periodo=mes

# Atualizar status de um pedido
PATCH /api/admin/orders/15/status
```

## ✅ **Status de Implementação**

- ✅ **Schema de validação** - Completo
- ✅ **Model com lógica de negócio** - Completo
- ✅ **Controller com endpoints** - Completo
- ✅ **Rotas cliente e admin** - Completo
- ✅ **Integração no sistema** - Completo
- ✅ **Filtros e paginação** - Completo
- ✅ **Busca avançada** - Completo
- ✅ **Relatórios estatísticos** - Completo
- ✅ **Segurança e validações** - Completo

## 📈 **Próximas Melhorias**

- [ ] Notificações automáticas por email/SMS
- [ ] Integração com APIs de rastreamento
- [ ] Histórico de mudanças de status
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Dashboard visual para admin
- [ ] Sistema de devoluções
- [ ] Avaliações de pedidos

**O módulo de pedidos está 100% funcional e pronto para uso! 🚀**
