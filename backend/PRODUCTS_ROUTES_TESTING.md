# 🛍️ Guia de Testes - Rotas de Produtos

## 🔧 **Configuração Inicial no Postman**
1. **Environment:** Selecione "E-commerce Development"
2. **URLs Base:** 
   - Produtos Públicos: `{{baseURL}}/api/public/products`
   - Admin: `{{baseURL}}/api/admin/products`

## 🧪 **Rotas Públicas (SEM autenticação)**

### **1. 📋 Listar Produtos**
```
GET {{baseURL}}/api/public/products
```

**Parâmetros de Query (opcionais):**
```
?categoria_id=1&search=iphone&preco_min=1000&preco_max=5000&page=1&limit=10
```

### **2. 🔍 Detalhes do Produto**
```
GET {{baseURL}}/api/public/products/1
```

---

## 🔐 **Rotas Admin (REQUER autenticação + admin)**

### **3. 📊 Estatísticas de Produtos**
```
GET {{baseURL}}/api/admin/products/stats
Authorization: Bearer {{authToken}}
```

### **4. 📋 Listar Todos os Produtos (Admin)**
```
GET {{baseURL}}/api/admin/products
Authorization: Bearer {{authToken}}
```

### **5. ➕ Criar Produto**
```
POST {{baseURL}}/api/admin/products
Authorization: Bearer {{authToken}}
Content-Type: application/json

{
  "nome": "iPhone 16 Pro Max",
  "descricao": "Novo iPhone com chip A18 Pro e câmera de 48MP",
  "preco": 9999.99,
  "estoque": 10,
  "categoria_id": 1,
  "imagem": "https://example.com/iphone16.jpg"
}
```

### **6. ✏️ Atualizar Produto**
```
PATCH {{baseURL}}/api/admin/products/1
Authorization: Bearer {{authToken}}
Content-Type: application/json

{
  "nome": "iPhone 15 Pro - Atualizado",
  "preco": 8499.99,
  "estoque": 20
}
```

### **7. 📦 Atualizar Estoque**
```
PATCH {{baseURL}}/api/admin/products/1/stock
Authorization: Bearer {{authToken}}
Content-Type: application/json

{
  "estoque": 50
}
```

### **8. 🔍 Detalhes do Produto (Admin)**
```
GET {{baseURL}}/api/admin/products/1
Authorization: Bearer {{authToken}}
```

### **9. 🗑️ Deletar Produto**
```
DELETE {{baseURL}}/api/admin/products/1
Authorization: Bearer {{authToken}}
```

---

## 📝 **Exemplos de Filtros de Busca**

### **Por Categoria:**
```
GET {{baseURL}}/api/public/products?categoria_id=1
```

### **Por Nome/Descrição:**
```
GET {{baseURL}}/api/public/products?search=iphone
```

### **Por Faixa de Preço:**
```
GET {{baseURL}}/api/public/products?preco_min=1000&preco_max=5000
```

### **Combinando Filtros:**
```
GET {{baseURL}}/api/public/products?categoria_id=1&search=pro&preco_max=10000&page=1&limit=5
```

---

## 🎯 **Casos de Teste Recomendados**

### **🔓 Testes Públicos:**
1. ✅ **Listar produtos** → Ver produtos em estoque
2. ✅ **Buscar por categoria** → Filtrar por categoria
3. ✅ **Buscar por nome** → Filtrar por texto
4. ✅ **Paginação** → Testar page e limit
5. ✅ **Detalhes** → Ver produto específico
6. ❌ **Produto sem estoque** → Não deve aparecer
7. ❌ **Produto inexistente** → 404

### **🔐 Testes Admin:**
1. ✅ **Login como admin** → Obter token
2. ✅ **Criar produto** → Adicionar novo produto
3. ✅ **Listar todos** → Ver produtos c/ e s/ estoque
4. ✅ **Atualizar produto** → Modificar dados
5. ✅ **Atualizar estoque** → Modificar quantidade
6. ✅ **Ver estatísticas** → Dados agregados
7. ✅ **Deletar produto** → Remover produto
8. ❌ **Sem token** → 401 Unauthorized
9. ❌ **Token cliente** → 403 Forbidden

---

## 🚨 **Códigos de Resposta**

- **200** ✅ Sucesso (GET, PATCH)
- **201** ✅ Criado (POST)
- **400** ❌ Dados inválidos
- **401** ❌ Não autenticado
- **403** ❌ Sem permissão (não admin)
- **404** ❌ Produto não encontrado
- **500** ❌ Erro do servidor

---

## 🗃️ **Validações Aplicadas**

### **Criar/Atualizar Produto:**
- **Nome:** 2-100 caracteres (obrigatório na criação)
- **Descrição:** máximo 1000 caracteres
- **Preço:** número positivo (obrigatório na criação)
- **Estoque:** número inteiro ≥ 0 (obrigatório na criação)
- **Categoria:** ID válido (obrigatório na criação)
- **Imagem:** máximo 255 caracteres

### **Filtros de Busca:**
- **Categoria:** número inteiro positivo
- **Search:** máximo 100 caracteres
- **Preço min/max:** números positivos
- **Page:** mínimo 1
- **Limit:** 1-50 (padrão: 10)

---

## 💡 **Dicas de Teste**

1. **Crie um usuário admin** primeiro
2. **Insira os dados de teste** usando o SQL fornecido
3. **Teste rotas públicas** antes das admin
4. **Verifique paginação** com diferentes limits
5. **Teste validações** com dados inválidos

Agora você pode testar todas as funcionalidades de produtos! 🚀
