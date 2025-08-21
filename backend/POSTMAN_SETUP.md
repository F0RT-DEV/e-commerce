# 🚀 Configuração do Postman para E-commerce API

## 📦 Importando Environment e Collection

### 1. **Importar Environment**
1. Abra o Postman
2. Clique no ícone de engrenagem (⚙️) → "Import"
3. Selecione o arquivo `postman-environment.json`
4. O environment "E-commerce Development" será criado automaticamente

### 2. **Importar Collection**
1. No Postman, clique em "Import"
2. Selecione o arquivo `postman-collection.json`
3. A collection "E-commerce API" será importada com todas as requisições

## 🎯 **Como Usar as Variáveis**

### **Variáveis Principais:**
- `{{baseURL}}` = `http://localhost:3333`
- `{{rota}}` = `http://localhost:3333/api/auth`
- `{{adminURL}}` = `http://localhost:3333/api/admin`
- `{{clientURL}}` = `http://localhost:3333/api/client`
- `{{statusURL}}` = `http://localhost:3333/api/status`
- `{{productsURL}}` = `http://localhost:3333/api/public/products`
- `{{categoriesURL}}` = `http://localhost:3333/api/public/categories`

### **Uso nas Requisições:**
```
GET  {{statusURL}}                    # Status da API
POST {{rota}}/register               # Registrar usuário
POST {{rota}}/login                  # Login
GET  {{rota}}/me                     # Perfil do usuário
PATCH {{rota}}/me                    # Atualizar perfil
PATCH {{rota}}/me/password           # Atualizar senha
PATCH {{rota}}/me/email              # Atualizar email
DELETE {{rota}}/me                   # Deletar conta
GET  {{rota}}/me/stats               # Estatísticas do usuário
POST {{rota}}/forgot-password        # Esqueci minha senha
POST {{rota}}/reset-password         # Redefinir senha
POST {{rota}}/test                   # Teste de rota
```

### **📋 Headers para Rotas Autenticadas:**
Para todas as rotas que requerem autenticação, adicione os seguintes headers:

```
Content-Type: application/json
Authorization: Bearer {{authToken}}
```

**🔐 Rotas que precisam de token:**
- Todas as rotas em `{{rota}}/me/*` (perfil, senha, email, stats, deletar)
- Todas as rotas em `{{adminURL}}/*` (administração)
- Todas as rotas em `{{clientURL}}/*` (carrinho, notificações, pedidos)
- Rota de verificar cupom: `{{baseURL}}/api/coupons/verify`

## 🔐 **Autenticação Automática**

A requisição de **Login** está configurada para:
1. Fazer login automaticamente
2. Extrair o token da resposta
3. Salvar o token na variável `{{authToken}}`
4. Usar automaticamente em rotas protegidas

### **Header de Autorização:**
```
Authorization: Bearer {{authToken}}
```

## 🌐 **Ambientes Diferentes**

Você pode criar environments para diferentes ambientes:

### **Development:**
```json
{
  "baseURL": "http://localhost:3333",
  "rota": "{{baseURL}}/api/auth"
}
```

### **Production:**
```json
{
  "baseURL": "https://api.seusite.com",
  "rota": "{{baseURL}}/api/auth"
}
```

### **Staging:**
```json
{
  "baseURL": "https://staging-api.seusite.com",
  "rota": "{{baseURL}}/api/auth"
}
```

## 📋 **Rotas Disponíveis**

### **Status da API:**
```
GET {{baseURL}}/api/status
```
Retorna informações sobre a API e rotas disponíveis.

### **Autenticação e Perfil:**
```
POST {{rota}}/register           # Registrar usuário
POST {{rota}}/login             # Login
GET  {{rota}}/me               # Obter perfil (requer auth)
PATCH {{rota}}/me              # Atualizar perfil (requer auth)
PATCH {{rota}}/me/password     # Atualizar senha (requer auth)
PATCH {{rota}}/me/email        # Atualizar email (requer auth)
DELETE {{rota}}/me             # Deletar conta (requer auth)
GET  {{rota}}/me/stats         # Estatísticas (requer auth)
POST {{rota}}/forgot-password  # Esqueci senha
POST {{rota}}/reset-password   # Redefinir senha
POST {{rota}}/test             # Teste de rota
```

#### **Registrar Usuário:**
```json
POST {{rota}}/register
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456789",
  "tipo": "cliente",
  "telefone": "(11) 99999-9999",
  "endereco": {
    "cep": "01234-567",
    "rua": "Rua das Flores",
    "numero": "123",
    "complemento": "Apto 45",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP"
  }
}
```

#### **Login:**
```json
POST {{rota}}/login
{
  "email": "joao@email.com",
  "senha": "123456789"
}
```

#### **Atualizar Perfil:**
```
Headers:
Content-Type: application/json
Authorization: Bearer {{authToken}}

Body:
```
```json
PATCH {{rota}}/me
{
  "nome": "João Santos Silva",
  "telefone": "(11) 88888-8888",
  "endereco": {
    "cep": "04567-890",
    "rua": "Av. Paulista",
    "numero": "1000",
    "bairro": "Bela Vista",
    "cidade": "São Paulo",
    "estado": "SP"
  }
}
```

#### **Atualizar Senha:**
```
Headers:
Content-Type: application/json
Authorization: Bearer {{authToken}}

Body:
```
```json
PATCH {{rota}}/me/password
{
  "senha_atual": "123456789",
  "nova_senha": "novaSenha123"
}
```

#### **Atualizar Email:**
```
Headers:
Content-Type: application/json
Authorization: Bearer {{authToken}}

Body:
```
```json
PATCH {{rota}}/me/email
{
  "novo_email": "joao.novo@email.com",
  "senha": "novaSenha123"
}
```

#### **Esqueci Minha Senha:**
```json
POST {{rota}}/forgot-password
{
  "email": "joao@email.com"
}
```

#### **Redefinir Senha:**
```json
POST {{rota}}/reset-password
{
  "token": "token_recebido_por_email",
  "nova_senha": "senhaNova123"
}
```

### **Administração:**
```
GET    {{adminURL}}/products         # Listar produtos (admin)
POST   {{adminURL}}/products         # Criar produto (admin)
PUT    {{adminURL}}/products/:id     # Atualizar produto (admin)
DELETE {{adminURL}}/products/:id     # Deletar produto (admin)
GET    {{adminURL}}/products/stats   # Estatísticas produtos (admin)

GET    {{adminURL}}/categories       # Listar categorias (admin)
POST   {{adminURL}}/categories       # Criar categoria (admin)
PATCH  {{adminURL}}/categories/:id   # Atualizar categoria (admin)
DELETE {{adminURL}}/categories/:id   # Deletar categoria (admin)
GET    {{adminURL}}/categories/stats # Estatísticas categorias (admin)

GET    {{adminURL}}/orders           # Listar pedidos (admin)
GET    {{adminURL}}/orders/:id       # Buscar pedido específico (admin)
PATCH  {{adminURL}}/orders/:id/status # Atualizar status do pedido (admin)
GET    {{adminURL}}/orders/reports   # Relatórios de pedidos (admin)

GET    {{adminURL}}/coupons          # Listar cupons (admin)
POST   {{adminURL}}/coupons          # Criar cupom (admin)
GET    {{adminURL}}/coupons/stats    # Estatísticas cupons (admin)
GET    {{adminURL}}/coupons/:id      # Buscar cupom por ID (admin)
PUT    {{adminURL}}/coupons/:id      # Atualizar cupom (admin)
PATCH  {{adminURL}}/coupons/:id      # Atualizar cupom parcial (admin)
DELETE {{adminURL}}/coupons/:id      # Deletar cupom (admin)
```

#### **Criar Produto (Admin):**
```
Headers:
Content-Type: application/json
Authorization: Bearer {{authToken}}

Body:
```
```json
POST {{adminURL}}/products
{
  "nome": "Smartphone Galaxy S24",
  "descricao": "Smartphone top de linha com 256GB",
  "preco": 2999.99,
  "estoque": 50,
  "categoria_id": 1,
  "imagem": "https://example.com/galaxy-s24.jpg"
}
```

#### **Atualizar Produto (Admin):**
```
Headers:
Content-Type: application/json
Authorization: Bearer {{authToken}}

Body:
```
```json
PUT {{adminURL}}/products/1
{
  "nome": "Smartphone Galaxy S24 Ultra",
  "descricao": "Versão Ultra com 512GB",
  "preco": 3999.99,
  "estoque": 30,
  "categoria_id": 1,
  "imagem": "https://example.com/galaxy-s24-ultra.jpg"
}
```

#### **Criar Categoria (Admin):**
```
Headers:
Content-Type: application/json
Authorization: Bearer {{authToken}}

Body:
```
```json
POST {{adminURL}}/categories
{
  "nome": "Eletrônicos",
  "descricao": "Produtos eletrônicos em geral"
}
```

#### **Atualizar Categoria (Admin):**
```
Headers:
Content-Type: application/json
Authorization: Bearer {{authToken}}

Body:
```
```json
PATCH {{adminURL}}/categories/1
{
  "nome": "Eletrônicos e Tecnologia",
  "descricao": "Smartphones, tablets, notebooks e acessórios"
}
```

#### **Criar Cupom (Admin):**
```
Headers:
Content-Type: application/json
Authorization: Bearer {{authToken}}

Body:
```
```json
POST {{adminURL}}/coupons
{
  "codigo": "DESCONTO20",
  "tipo": "percentual",
  "valor": 20,
  "validade": "2025-12-31",
  "limite_uso": 100,
  "ativo": true
}
```

#### **Atualizar Cupom (Admin):**
```
Headers:
Content-Type: application/json
Authorization: Bearer {{authToken}}

Body:
```
```json
PUT {{adminURL}}/coupons/1
{
  "codigo": "DESCONTO25",
  "tipo": "percentual", 
  "valor": 25,
  "validade": "2025-12-31",
  "limite_uso": 200,
  "ativo": true
}
```

#### **Listar Pedidos (Admin):**
```
Headers:
Authorization: Bearer {{authToken}}
```
```json
GET {{adminURL}}/orders?page=1&limit=20&status=pendente
```

**Resposta de Sucesso:**
```json
{
  "message": "Pedidos listados com sucesso",
  "pedidos": [
    {
      "id": 3,
      "usuario_id": 3,
      "usuario_nome": "João Silva",
      "usuario_email": "joao@email.com",
      "subtotal": "3799.98",
      "valor_desconto": "760.00",
      "valor_frete": "15.00",
      "total": "3054.98",
      "status": "pendente",
      "metodo_pagamento": "credit_card",
      "codigo_cupom": "DESCONTO20",
      "endereco_cidade": "São Paulo",
      "endereco_estado": "SP",
      "criado_em": "2025-08-18T22:51:42.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 3,
    "pages": 1
  }
}
```

#### **Atualizar Status do Pedido (Admin):**
```
Headers:
Content-Type: application/json
Authorization: Bearer {{authToken}}

Body:
```
```json
PATCH {{adminURL}}/orders/3/status
{
  "status": "enviado",
  "observacoes_admin": "Pedido enviado via transportadora. Prazo de entrega: 3-5 dias úteis."
}
```

**Status Válidos:**
- `pendente` - Pedido criado, aguardando processamento
- `processando` - Pedido sendo preparado
- `enviado` - Pedido enviado (necessário para permitir avaliações)
- `entregue` - Pedido entregue ao cliente
- `cancelado` - Pedido cancelado

**Resposta de Sucesso:**
```json
{
  "message": "Status do pedido atualizado com sucesso",
  "pedido": {
    "id": 3,
    "usuario_id": 3,
    "total": "3054.98",
    "status": "enviado",
    "metodo_pagamento": "credit_card",
    "atualizado_em": "2025-08-18T23:20:00.000Z"
  }
}
```

**📝 Importante para Avaliações:**
- Para que o cliente possa fazer avaliações de produtos, o pedido deve estar com status **"enviado"** ou **"entregue"**
- Quando o status muda para "enviado", uma notificação é criada automaticamente para o cliente
- O sistema de avaliações verifica se o usuário já comprou o produto antes de permitir a avaliação

### **Produtos Públicos:**
```
GET    {{productsURL}}               # Listar produtos públicos
GET    {{productsURL}}/search        # Buscar produtos
GET    {{productsURL}}/:id           # Detalhes do produto
```

### **Categorias Públicas:**
```
GET    {{categoriesURL}}             # Listar categorias públicas
GET    {{categoriesURL}}/:id         # Detalhes da categoria
```

### **Cliente - Carrinho:**
```
GET  {{clientURL}}/cart              # Visualizar carrinho
POST {{clientURL}}/cart              # Adicionar produto ao carrinho
PATCH {{clientURL}}/cart/:produto_id # Atualizar quantidade
DELETE {{clientURL}}/cart/:produto_id # Remover item do carrinho
DELETE {{clientURL}}/cart            # Limpar carrinho
POST {{clientURL}}/cart/apply-coupon # Aplicar cupom ao carrinho
DELETE {{clientURL}}/cart/remove-coupon # Remover cupom do carrinho
POST {{clientURL}}/cart/checkout     # Finalizar compra
```

#### **Adicionar ao Carrinho:**
```
Headers:
Content-Type: application/json
Authorization: Bearer {{authToken}}

Body:
```
```json
POST {{clientURL}}/cart
{
  "produto_id": 1,
  "quantidade": 2
}
```

#### **Atualizar Quantidade:**
```
Headers:
Content-Type: application/json
Authorization: Bearer {{authToken}}

Body:
```
```json
PATCH {{clientURL}}/cart/1
{
  "quantidade": 3
}
```

#### **Finalizar Compra (Checkout):**
```
Headers:
Content-Type: application/json
Authorization: Bearer {{authToken}}

Body:
```
```json
POST {{clientURL}}/cart/checkout
{
  "shipping_address": {
    "cep": "01234-567",
    "rua": "Rua das Flores",
    "numero": "123",
    "complemento": "Apto 45",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP"
  },
  "payment_method": "cartao_credito",
  "coupon": "DESCONTO10",
  "observacoes": "Entrega pela manhã"
}
```

### **Corpo das Requisições:**

#### **Aplicar Cupom ao Carrinho:**
```
Headers:
Content-Type: application/json
Authorization: Bearer {{authToken}}

Body:
```
```json
POST {{clientURL}}/cart/apply-coupon
{
  "codigo": "DESCONTO10"
}
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Cupom aplicado com sucesso",
  "data": {
    "cupom": {
      "codigo": "DESCONTO10",
      "tipo": "percentual",
      "valor": 10,
      "desconto": 25.99
    },
    "carrinho": {
      "itens": [...],
      "total_itens": 2,
      "subtotal": 259.90,        // 💰 Valor original
      "total": 259.90,           // 💰 Valor original
      "cupom": {
        "codigo": "DESCONTO10",
        "tipo": "percentual", 
        "valor": 10,
        "desconto": 25.99       // 💸 Valor do desconto
      },
      "total_com_desconto": 233.91,  // ✅ Valor final (com desconto)
      "desconto_aplicado": 25.99     // 💸 Desconto aplicado
    }
  }
}
```

**📝 Explicação dos Campos:**
- `subtotal` / `total`: Valor original do carrinho
- `desconto_aplicado`: Valor em R$ que foi descontado
- `total_com_desconto`: **Valor final que o cliente pagará**

#### **Remover Cupom do Carrinho:**
```json
DELETE {{clientURL}}/cart/remove-coupon
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Cupom removido do carrinho",
  "data": {
    "carrinho": {
      "itens": [...],
      "total_itens": 2,
      "subtotal": 259.90,
      "total": 259.90
    }
  }
}
```

### **Cupons Públicos:**
```
GET  {{baseURL}}/api/coupons         # Listar cupons ativos (público)
```

### **Cupons (Autenticado):**
```
POST {{baseURL}}/api/coupons/verify  # Verificar cupom (requer auth)
```

#### **Verificar Cupom:**
```
Headers:
Content-Type: application/json
Authorization: Bearer {{authToken}}

Body:
```
```json
POST {{baseURL}}/api/coupons/verify
{
  "codigo": "DESCONTO10"
}
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Cupom válido",
  "data": {
    "cupom": {
      "id": 1,
      "codigo": "DESCONTO10",
      "tipo": "percentual",
      "valor": "10.00",
      "validade": "2025-12-31T23:59:59.000Z"
    }
  }
}
```

### **Cliente (futuras):**
```
GET  {{clientURL}}/orders        # Pedidos
POST {{clientURL}}/orders        # Criar pedido
```

### **📩 Cliente - Notificações (`/api/client/notifications`)**
```
GET {{clientURL}}/notifications      # Listar notificações do usuário
PATCH {{clientURL}}/notifications/:id/read # Marcar como lida
DELETE {{clientURL}}/notifications/:id # Excluir notificação
PATCH {{clientURL}}/notifications/read-all # Marcar todas como lidas
POST {{clientURL}}/notifications/mark-all-read # Marcar todas como lidas (alias)
GET {{clientURL}}/notifications/stats # Estatísticas das notificações
```

#### **Marcar Notificação como Lida:**
```
Headers:
Authorization: Bearer {{authToken}}

Body: (Sem body necessário)
```
```json
PATCH {{clientURL}}/notifications/1/read
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Notificação marcada como lida"
}
```

#### **Marcar Todas as Notificações como Lidas:**
```
Headers:
Authorization: Bearer {{authToken}}

Body: (Sem body necessário)
```

**Opção 1 (PATCH):**
```json
PATCH {{clientURL}}/notifications/read-all
```

**Opção 2 (POST - alias):**
```json
POST {{clientURL}}/notifications/mark-all-read
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Todas as notificações foram marcadas como lidas",
  "data": {
    "updated_count": 5
  }
}
```

### **🔔 Administração - Notificações (`/api/admin/notifications`)**
```
GET {{adminURL}}/notifications      # Listar todas notificações (admin)
POST {{adminURL}}/notifications     # Criar notificação (admin)
PATCH {{adminURL}}/notifications/:id # Atualizar notificação (admin)
DELETE {{adminURL}}/notifications/:id # Deletar notificação (admin)
GET {{adminURL}}/notifications/stats # Estatísticas globais (admin)
```

#### **Criar Notificação (Admin):**
```
Headers:
Content-Type: application/json
Authorization: Bearer {{authToken}}

Body:
```
```json
POST {{adminURL}}/notifications
{
  "usuario_id": 1,
  "titulo": "Oferta Especial",
  "mensagem": "Aproveite 20% de desconto em eletrônicos!",
  "tipo": "promocao"
}
```

#### **Atualizar Notificação (Admin):**
```
Headers:
Content-Type: application/json
Authorization: Bearer {{authToken}}

Body:
```
```json
PATCH {{adminURL}}/notifications/1
{
  "titulo": "Oferta Imperdível - Atualizada",
  "mensagem": "Agora com 30% de desconto em eletrônicos!",
  "lida": true
}
```

### **📦 Cliente - Pedidos (Em Desenvolvimento):**
```
GET  {{clientURL}}/orders        # Listar pedidos do usuário
GET  {{clientURL}}/orders/:id    # Detalhes do pedido
```

### **⭐ Avaliações de Produtos**

#### **📋 Públicas (Visualizar avaliações):**
```
GET {{baseURL}}/api/public/products/:produto_id/reviews      # Listar avaliações de um produto
GET {{baseURL}}/api/public/products/:produto_id/reviews/stats # Estatísticas de avaliações
```

#### **👤 Cliente (Gerenciar suas avaliações):**
```
POST {{clientURL}}/products/:produto_id/review # Criar avaliação
GET {{clientURL}}/reviews                      # Listar suas avaliações
GET {{clientURL}}/reviews/:id                  # Buscar avaliação específica
PUT {{clientURL}}/reviews/:id                  # Atualizar sua avaliação
DELETE {{clientURL}}/reviews/:id               # Deletar sua avaliação
```

#### **Criar Avaliação:**
```
Headers:
Content-Type: application/json
Authorization: Bearer {{authToken}}

Body:
```
```json
POST {{clientURL}}/products/1/review
{
  "nota": 5,
  "comentario": "Excelente produto! Superou minhas expectativas."
}
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Avaliação criada com sucesso",
  "data": {
    "review": {
      "id": 1,
      "produto_id": 1,
      "usuario_id": 3,
      "nota": 5,
      "comentario": "Excelente produto! Superou minhas expectativas.",
      "criado_em": "2025-08-18T22:15:00.000Z",
      "usuario_nome": "João Silva",
      "produto_nome": "Smartphone Galaxy S24"
    }
  }
}
```

#### **Listar Avaliações de um Produto (Público):**
```json
GET {{baseURL}}/api/public/products/1/reviews?page=1&limit=10&order=desc
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Avaliações listadas com sucesso",
  "data": {
    "produto": {
      "id": 1,
      "nome": "Smartphone Galaxy S24"
    },
    "stats": {
      "total_avaliacoes": 15,
      "nota_media": 4.3,
      "maior_nota": 5,
      "menor_nota": 2,
      "distribuicao_notas": {
        "5": 8,
        "4": 4,
        "3": 2,
        "2": 1,
        "1": 0
      }
    },
    "reviews": [
      {
        "id": 1,
        "produto_id": 1,
        "usuario_id": 3,
        "nota": 5,
        "comentario": "Excelente produto!",
        "criado_em": "2025-08-18T22:15:00.000Z",
        "usuario_nome": "João Silva"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 15,
      "total_pages": 2,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

#### **Estatísticas de Avaliações:**
```json
GET {{baseURL}}/api/public/products/1/reviews/stats
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Estatísticas obtidas com sucesso",
  "data": {
    "produto": {
      "id": 1,
      "nome": "Smartphone Galaxy S24"
    },
    "stats": {
      "total_avaliacoes": 15,
      "nota_media": 4.3,
      "maior_nota": 5,
      "menor_nota": 2,
      "distribuicao_notas": {
        "5": 8,
        "4": 4,
        "3": 2,
        "2": 1,
        "1": 0
      }
    }
  }
}
```

#### **Listar Suas Avaliações:**
```
Headers:
Authorization: Bearer {{authToken}}
```
```json
GET {{clientURL}}/reviews?page=1&limit=10
```

#### **Atualizar Sua Avaliação:**
```
Headers:
Content-Type: application/json
Authorization: Bearer {{authToken}}

Body:
```
```json
PUT {{clientURL}}/reviews/1
{
  "nota": 4,
  "comentario": "Bom produto, mas o preço poderia ser melhor."
}
```

### **📝 Regras de Negócio - Avaliações:**
- ✅ **Apenas após compra e envio**: Só pode avaliar produtos que já comprou e que tenham status "enviado" ou "entregue"
- ✅ **Uma avaliação por produto**: Cada usuário pode fazer apenas 1 avaliação por produto
- ✅ **Notas de 1 a 5**: Sistema de estrelas obrigatório
- ✅ **Comentário opcional**: Pode avaliar só com nota ou adicionar comentário
- ✅ **Edição permitida**: Usuário pode atualizar ou deletar sua própria avaliação
- ✅ **Visualização pública**: Qualquer pessoa pode ver as avaliações (sem autenticação)

## **🎯 Exemplos de Uso Completo**

### **Fluxo Completo de Compra:**

1. **Registrar usuário**
2. **Fazer login**
3. **Adicionar produtos ao carrinho**
4. **Aplicar cupom**
5. **Finalizar compra**

### **Códigos de Status HTTP:**
- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro de validação
- `401` - Não autorizado
- `403` - Acesso negado
- `404` - Não encontrado
- `409` - Conflito (ex: cupom já usado)
- `500` - Erro interno do servidor

### **⚡ Dicas de Uso:**
- ✅ **Headers Obrigatórios para Rotas Autenticadas:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {{authToken}}`
- ✅ Para rotas de admin, o usuário deve ter `role: 'admin'`
- ✅ Cupons têm validação de data, limite de uso e status ativo
- ✅ Notificações são criadas automaticamente para ações importantes (checkout, mudança de status, etc.)
- ✅ Use o environment correto (Development/Production) antes de fazer as requisições
- ✅ Faça login primeiro para obter o token automaticamente

---

**🚀 Sistema de E-commerce com Cupons e Notificações - Pronto para uso!**
      {
        "id": 1,
        "usuario_id": 1,
        "titulo": "Pedido Confirmado! 🎉",
        "mensagem": "Seu pedido #123 foi confirmado com sucesso!",
        "lida": false,
        "criado_em": "2025-08-17T10:30:00.000Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 15,
      "total_pages": 2,
      "has_next": true,
      "has_prev": false
    },
    "stats": {
      "total": 15,
      "lidas": 8,
      "nao_lidas": 7
    }
  }
}
```

## 🔧 **Configuração Manual**

Se preferir configurar manualmente:

1. **Crie um Environment** chamado "E-commerce Development"
2. **Adicione as variáveis:**
   - `baseURL`: `http://localhost:3333`
   - `rota`: `{{baseURL}}/api/auth`
   - `authToken`: (deixe vazio, será preenchido automaticamente)

3. **Selecione o Environment** no dropdown superior direito
4. **Use as variáveis** nas suas requisições: `{{rota}}/register`

## ✅ **Vantagens:**

- ✅ **URLs Dinâmicas:** Mude de desenvolvimento para produção instantaneamente
- ✅ **Token Automático:** Login salva o token automaticamente
- ✅ **Organização:** Rotas organizadas por módulos
- ✅ **Reutilização:** Compartilhe environments entre membros da equipe
- ✅ **Produtividade:** Digite menos, teste mais!

## 🧪 **Testando:**

1. Selecione o environment "E-commerce Development"
2. Execute a requisição "Status da API" para verificar se o servidor está online
3. Execute "Registrar Usuário" para criar um usuário
4. Execute "Login" (o token será salvo automaticamente)
5. Execute "Obter Perfil" para testar a autenticação

Agora você pode usar `{{rota}}` como seu colega! 🎉
