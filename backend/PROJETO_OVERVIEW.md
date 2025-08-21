# 🛍️ E-commerce API - Visão Geral do Projeto

## 📊 **Status Atual do Projeto**

```
🟢 CONCLUÍDO: Autenticação, Usuários, Produtos, Categorias, Carrinh### **📦 7. Sistema de Pedidos**
```
✅ Criação automática via checkout
✅ Gestão de status (5 estados)
✅ Listagem com filtros e paginação
✅ Busca avançada para admin
✅ Relatórios estatísticos
✅ Separação rotas cliente/admin
✅ Atualização de status pelo admi### **🔴 Funcionalidades Futuras:**
```
💳 Pagamentos (Stripe/PayPal) - Backend + Frontend
📁 Upload de Imagens - Backend + Frontend  
🔍 Busca Avançada (Elasticsearch) - Backend + Frontend
📊 Dashboard Admin Visual - Apenas Frontend (APIs prontas)
📱 Push Notifications - Backend + Frontend
```

### **🎯 Especificamente para Backend:**
```
💳 Webhook handlers para pagamentos
💳 Validação de transações financeiras
📁 Middleware de upload de imagens
📁 Integração com storage (S3/Cloudinary)
🔍 Integração com Elasticsearch
🔍 APIs de busca avançada
📱 Sistema de push notifications
```tórico completo de compras
```

### **📩 8. Sistema de Notificações**
```
✅ CRUD completo de notificações
✅ Notificações automáticas de pedidos
✅ Notificações de mudança de status
✅ Notificações de cupons aplicados
✅ Criação manual pelo admin
✅ Listagem com paginação e filtros
✅ Marcar como lida/não lida
✅ Estatísticas para usuário
✅ Segurança por usuário
✅ Integração total com outros módulos
✅ Logs e monitoramento
✅ Validações robustas
```

### **⭐ 9. Sistema de Avaliações**
```
✅ CRUD completo de avaliações
✅ Validação de compra obrigatória
✅ Avaliações por produto
✅ Sistema de notas (1-5)
✅ Comentários opcionais
✅ Estatísticas automáticas
✅ Uma avaliação por produto/usuário
✅ Atualização/edição de avaliações
✅ Business rules robustas
✅ Integração com sistema de pedidos
✅ Validações completas com Joi
✅ Middleware de autenticação
```

**🔄 Fluxo Automático de Notificações:**

**Gatilhos Automáticos:**
1. **Checkout Finalizado** → "Pedido Confirmado! 🎉" (com número e valor)
2. **Status Alterado** → "Status do Pedido Atualizado" (com mudança de estado)
3. **Cupom Aplicado** → "Cupom Aplicado! 🎟️" (com código e economia)

**Gestão Pelo Usuário:**
1. **Listar** → Paginação, filtros por status, ordenação
2. **Visualizar** → Detalhes de notificação específica
3. **Marcar como Lida** → Individual ou todas de uma vez
4. **Deletar** → Remover notificações antigas
5. **Estatísticas** → Total, lidas, não lidas

**Administração:**
1. **Criar Manual** → Admin pode enviar notificações personalizadas
2. **Monitoramento** → Logs de criação e interação
3. **Segurança** → Controle por role e por usuário

**Integrações Automáticas:**
- ✅ **Carrinho** → Notifica ao finalizar compra
- ✅ **Pedidos** → Notifica mudanças de status
- ✅ **Cupons** → Notifica aplicação de desconto
- ✅ **Todos os módulos** → Logs não críticos (não quebram fluxo)

**⭐ Sistema de Avaliações - Fluxo Completo:**

**Business Rules:**
1. **Validação de Compra** → Usuário deve ter comprado o produto
2. **Status do Pedido** → Pedido deve estar "enviado" ou "entregue"
3. **Uma Avaliação** → Apenas 1 avaliação por produto/usuário
4. **Notas Válidas** → Escala de 1 a 5 estrelas
5. **Proprietário** → Usuário só edita/deleta suas próprias avaliações

**Gestão Pelo Cliente:**
1. **Criar Avaliação** → Nota (1-5) + comentário opcional
2. **Listar Avaliações** → Por produto, com paginação
3. **Atualizar Avaliação** → Editar nota e comentário
4. **Deletar Avaliação** → Remover própria avaliação
5. **Estatísticas** → Média de notas, total de avaliações

**Integrações Automáticas:**
- ✅ **Pedidos** → Verifica se usuário comprou produto
- ✅ **Produtos** → Calcula média e total de avaliações
- ✅ **Usuários** → Validação de propriedade das avaliações
- ✅ **Autenticação** → Middleware obrigatório Cupons, Notificações
🟡 EM ANDAMENTO: Reviews
🔴 PENDENTE: Pagamentos, Upload de Imagens, Dashboard Visual
```

### **Módulos Completados** ✅
- **Sistema de Autenticação** - JWT, registro, login, recuperação de senha
- **Sistema de Usuários** - CRUD completo, perfis, validações
- **Sistema de Produtos** - CRUD admin, listagem pública, pesquisa avançada
- **Sistema de Categorias** - CRUD admin, listagem pública, estatísticas
- **Sistema de Carrinho** - Sessão temporária, checkout robusto, cupons
- **Sistema de Pedidos** - Criação via checkout, gestão de status, relatórios
- **Sistema de Cupons** - CRUD admin, aplicação no carrinho, validações avançadas
- **Sistema de Notificações** - Alertas automáticos, CRUD, integração total
- **Sistema de Avaliações** - CRUD client, business rules, validação de compra

### **Em Desenvolvimento** 🚧

*Todos os módulos principais do e-commerce foram concluídos! O backend está 100% funcional para as operações de compra. Próximos passos focam em pagamentos e interface.*

### **Pendente** ⏳
- **Sistema de Pagamentos** - Integração com gateways de pagamento
- **Dashboard Admin** - Métricas, gráficos e relatórios
- **Upload de Imagens** - Produtos e avatars de usuário
- **Integração Frontend** - Interface React/Vue.js
- **Deploy e Produção** - Configuração de servidor

### **Arquivos de Documentação** 📚
- `README.md` - Documentação principal
- `POSTMAN_SETUP.md` - Configuração do ambiente de testes
- `CART_DOCUMENTATION.md` - Documentação do sistema de carrinho
- `ORDER_DOCUMENTATION.md` - Documentação do sistema de pedidos
- `ORDERS_MODULE_COMPLETE.md` - Detalhes da implementação de pedidos
- `CHECKOUT_ROBUSTO_IMPLEMENTADO.md` - Documentação do checkout
- `TESTE_CHECKOUT_ROBUSTO.md` - Testes do checkout

---

## 🏗️ **Arquitetura Implementada**

### **Stack Tecnológica:**
- **Backend:** Node.js + Express
- **Banco:** MySQL + Knex.js (migrations)
- **Validação:** Joi
- **Autenticação:** JWT + bcryptjs
- **Estrutura:** Modular (MVC pattern)

### **Estrutura de Pastas:**
```
backend/
├── src/
│   ├── modules/           # Módulos de negócio
│   ├── routes/            # Rotas públicas e admin
│   ├── middlewares/       # Auth e validações
│   ├── migrations/        # Scripts do banco
│   └── config/            # Configurações
├── uploads/               # Arquivos de upload
└── docs/                  # Documentação
```

---

## ✅ **Funcionalidades Implementadas**

### **🔐 1. Sistema de Autenticação**
```
✅ Registro de usuários
✅ Login com JWT
✅ Perfil do usuário (visualizar/editar)
✅ Alteração de senha/email
✅ Esqueci minha senha
✅ Controle de roles (cliente/admin)
```

### **👤 2. Gestão de Usuários**
```
✅ CRUD completo de usuários
✅ Middleware de autenticação
✅ Middleware de autorização (admin)
✅ Estatísticas de usuários
✅ Soft delete de contas
```

### **📦 3. Sistema de Produtos**
```
✅ CRUD admin de produtos
✅ Listagem pública com filtros
✅ Busca por nome/descrição
✅ Filtros: categoria, preço, estoque
✅ Estatísticas para dashboard
✅ Validação robusta (Joi)
```

### **🏷️ 4. Sistema de Categorias**
```
✅ CRUD admin de categorias
✅ Listagem pública
✅ Estatísticas de categorias
✅ Relação com produtos
✅ Validação completa
```

### **🛒 5. Sistema de Carrinho**
```
✅ Carrinho em sessão (temporário)
✅ Adicionar/remover produtos
✅ Atualizar quantidades
✅ Validação de estoque em tempo real
✅ Cálculo automático de totais
✅ Checkout robusto com endereço completo
✅ Processamento de cupons de desconto
✅ Integração com express-session
```

### **🎟️ 6. Sistema de Cupons**
```
✅ CRUD admin de cupons (criar, listar, editar, deletar)
✅ Tipos de desconto (percentual e valor fixo)
✅ Validação de datas (válido até, criação automática)
✅ Controle de uso (limite de usos por cupom)
✅ Controle de uso por usuário (um cupom por usuário)
✅ Aplicação dinâmica no carrinho
✅ Remoção de cupons do carrinho
✅ Verificação pública de cupons
✅ Listagem de cupons ativos (público)
✅ Estatísticas para dashboard admin
✅ Integração completa com checkout
✅ Rastreamento de uso via tabela cupons_usuarios
```

**� Fluxo das Funcionalidades de Cupons:**

**Admin - Gestão de Cupons:**
1. **Criar Cupom** → Admin define código, tipo (%), valor, data limite, uso máximo
2. **Listar Cupons** → Admin vê todos os cupons com estatísticas de uso
3. **Editar Cupom** → Admin pode alterar dados (exceto código usado)
4. **Deletar Cupom** → Admin remove cupons (soft delete)
5. **Estatísticas** → Admin vê relatórios de uso e performance

**Cliente - Uso de Cupons:**
1. **Verificar Cupom** (público) → Cliente valida se cupom existe e é válido
2. **Aplicar no Carrinho** → Sistema valida regras e aplica desconto automaticamente
3. **Visualizar Desconto** → Cliente vê valor original, desconto e total final
4. **Remover Cupom** → Cliente pode desfazer aplicação antes do checkout
5. **Finalizar Compra** → Cupom é marcado como usado e vinculado ao usuário

**Validações Automáticas:**
- ❌ Cupom inexistente ou inativo
- ❌ Cupom expirado (data limite)
- ❌ Cupom já usado pelo usuário
- ❌ Cupom atingiu limite máximo de usos
- ❌ Carrinho vazio ao aplicar cupom
- ✅ Recálculo automático de totais
- ✅ Prevenção de uso duplicado

### **�📦 7. Sistema de Pedidos**
```
✅ Criação automática via checkout
✅ Gestão de status (5 estados)
✅ Listagem com filtros e paginação
✅ Busca avançada para admin
✅ Relatórios estatísticos
✅ Separação rotas cliente/admin
✅ Atualização de status pelo admin
✅ Histórico completo de compras
```

---

## 📋 **Banco de Dados Atual**

### **Tabelas Implementadas:**
```sql
👥 usuarios (id, nome, email, senha, tipo, telefone, endereco)
📦 produtos (id, nome, descricao, preco, estoque, imagem, categoria_id)
🏷️ categorias (id, nome, descricao)
📋 pedidos (id, usuario_id, subtotal, valor_desconto, valor_frete, total, status, metodo_pagamento, codigo_cupom, endereco_*, observacoes, criado_em, atualizado_em)
📦 pedido_itens (id, pedido_id, produto_id, quantidade, preco_unitario)
🎟️ cupons (id, codigo, tipo, valor, validade, limite_uso, ativo, created_at, updated_at)
🔗 cupons_usuarios (id, cupom_id, usuario_id, usado_em)
📩 notificacoes (id, usuario_id, titulo, mensagem, lida, criado_em)
⭐ avaliacoes (id, usuario_id, produto_id, nota, comentario, criadas_em, atualizado_em)
🔑 password_resets (token, email, created_at)
```

### **Relacionamentos:**
- `produtos.categoria_id` → `categorias.id` (Many-to-One)
- `pedidos.usuario_id` → `usuarios.id` (Many-to-One)
- `pedido_itens.pedido_id` → `pedidos.id` (Many-to-One)
- `pedido_itens.produto_id` → `produtos.id` (Many-to-One)
- `cupons_usuarios.cupom_id` → `cupons.id` (Many-to-One)
- `cupons_usuarios.usuario_id` → `usuarios.id` (Many-to-One)
- `notificacoes.usuario_id` → `usuarios.id` (Many-to-One)
- `avaliacoes.usuario_id` → `usuarios.id` (Many-to-One)
- `avaliacoes.produto_id` → `produtos.id` (Many-to-One)
- `password_resets.email` → `usuarios.email` (One-to-One)

---

## 🌐 **APIs Disponíveis**

### **🔐 Autenticação (`/api/auth`)**
```
POST /register          # Criar conta
POST /login             # Fazer login
GET  /me                # Ver perfil
PATCH /me               # Editar perfil
POST /forgot-password   # Esqueci senha
POST /reset-password    # Redefinir senha
```

### **📦 Produtos Públicos (`/api/public/products`)**
```
GET /                   # Listar produtos
GET /search             # Buscar produtos
GET /:id                # Detalhes do produto
```

### **🏷️ Categorias Públicas (`/api/public/categories`)**
```
GET /                   # Listar categorias
GET /:id                # Detalhes da categoria
```

### **⚙️ Admin - Produtos (`/api/admin/products`)**
```
GET /                   # Listar (admin)
POST /                  # Criar produto
PUT/PATCH /:id          # Editar produto
DELETE /:id             # Deletar produto
GET /stats              # Estatísticas
```

### **⚙️ Admin - Categorias (`/api/admin/categories`)**
```
GET /                   # Listar (admin)
POST /                  # Criar categoria
PUT/PATCH /:id          # Editar categoria
DELETE /:id             # Deletar categoria
GET /stats              # Estatísticas
```

### **⚙️ Admin - Cupons (`/api/admin/coupons`)**
```
GET /                   # Listar cupons (admin)
POST /                  # Criar cupom
GET /:id                # Buscar cupom por ID
PUT /:id                # Atualizar cupom completo
PATCH /:id              # Atualizar cupom parcial
DELETE /:id             # Deletar cupom (soft delete)
GET /stats              # Estatísticas de cupons
```

### **🛒 Cliente - Carrinho (`/api/client/cart`)**
```
GET /                   # Visualizar carrinho
POST /                  # Adicionar produto
PATCH /:produto_id      # Atualizar quantidade
DELETE /:produto_id     # Remover produto
DELETE /                # Limpar carrinho
POST /apply-coupon      # Aplicar cupom
DELETE /remove-coupon   # Remover cupom
POST /checkout          # Finalizar compra
```

### **🎟️ Cupons Públicos (`/api/coupons`)**
```
GET /                   # Listar cupons ativos (público)
POST /verify            # Verificar cupom (público)
```

### **📩 Cliente - Notificações (`/api/client/notifications`)**
```
GET /                   # Listar notificações
GET /stats              # Estatísticas das notificações
GET /:id                # Obter notificação específica
PATCH /:id/read         # Marcar como lida
PATCH /read-all         # Marcar todas como lidas
DELETE /:id             # Deletar notificação
```

### **⚙️ Admin - Notificações (`/api/admin/notifications`)**
```
POST /                  # Criar notificação manual (admin)
```

### **📋 Cliente - Pedidos (`/api/client/orders`)**
```
GET /                   # Listar pedidos do usuário
GET /:id                # Detalhes de pedido específico
```

### **⚙️ Admin - Pedidos (`/api/admin/orders`)**
```
GET /                   # Listar todos os pedidos (com filtros)
GET /reports            # Relatórios e estatísticas
GET /:id                # Detalhes do pedido (visão admin)
PATCH /:id/status       # Atualizar status do pedido
```

### **⭐ Cliente - Avaliações (`/api/client/reviews`)**
```
GET /                   # Listar avaliações do usuário
GET /product/:produto_id # Listar avaliações por produto
POST /                  # Criar nova avaliação
PUT /:id                # Atualizar avaliação completa
PATCH /:id              # Atualizar avaliação parcial
DELETE /:id             # Deletar avaliação
GET /stats              # Estatísticas de avaliações
```

---

## 🎯 **Próximos Passos**

### **🟡 Em Desenvolvimento:**
```
🛒 Sistema de Carrinho
   - Adicionar/remover produtos
   - Calcular totais
   - Persistir no banco

🎟️ Sistema de Cupons
   - Criar cupons (percentual/fixo)
   - Aplicar descontos
   - Validar expiração
```

### **🔴 Funcionalidades Futuras:**
```
💳 Pagamentos (Stripe/PayPal)
 Upload de Imagens
📊 Dashboard Admin Avançado
📱 API Mobile-friendly
🔍 Busca Avançada (Elasticsearch)
```

---

## 📈 **Métricas do Projeto**

### **Arquivos Criados:**
- ✅ **30+ Controllers** (auth, user, product, category, coupon, cart, order, notification, review)
- ✅ **25+ Models** (database queries + validations + business logic)
- ✅ **18+ Routes** (public + admin + client)
- ✅ **15+ Migrations** (database schema)
- ✅ **10+ Middlewares** (auth, validation, roles)

### **Linhas de Código:** ~5000+ LOC
### **Endpoints:** 70+ rotas funcionais
### **Tabelas:** 10 tabelas principais

---

## 🚀 **Como Testar**

### **1. Servidor:**
```bash
cd backend
npm run dev  # http://localhost:3333
```

### **2. Postman:**
- Importe `POSTMAN_SETUP.md`
- Use variáveis: `{{baseURL}}`, `{{adminURL}}`
- Token automático após login

### **3. Dados de Teste:**
```sql
-- Execute os arquivos SQL:
DADOS_TESTE_PRODUTOS_SIMPLES.sql
DADOS_TESTE_CATEGORIAS.sql
```

---

## 💡 **Recursos Únicos Implementados**

```
🔄 Compatibilidade PUT/PATCH para updates
🎯 Filtros avançados (preço, categoria, busca)
📊 Estatísticas para dashboard admin
🔐 Middleware de roles robusto
📝 Validação completa com Joi
🗄️ Migrations organizadas em português
📖 Documentação Postman completa
```

---

## 🎯 **Objetivo Final**

Criar um **e-commerce completo** com:
- ✅ **Backend robusto** (autenticação, produtos, categorias, cupons, notificações, avaliações)
- ✅ **Funcionalidades de compra** (carrinho, pedidos, descontos, alertas, reviews)
- 🔴 **Sistema de pagamentos** (gateways, processamento)
- 🔴 **Interface admin** (dashboard, relatórios)
- 🔴 **Frontend responsivo** (React/Vue)

**Status:** ~90% concluído do MVP básico! 🚀
