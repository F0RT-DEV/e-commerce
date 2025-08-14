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
```

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
POST {{clientURL}}/cart/checkout     # Finalizar compra
```

### **Cliente (futuras):**
```
GET  {{clientURL}}/orders        # Pedidos
POST {{clientURL}}/orders        # Criar pedido
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
