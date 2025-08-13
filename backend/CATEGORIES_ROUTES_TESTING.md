# 🏷️ Documentação das Rotas de Categorias

## 📋 **Rotas Públicas de Categorias**

### **Base URL:** `{{categoriesURL}}` = `http://localhost:3333/api/public/categories`

---

## 🌐 **1. Listar Categorias (Público)**
```
GET {{categoriesURL}}
```

### **Query Parameters (opcionais):**
- `q` - Buscar por nome da categoria
- `page` - Página (padrão: 1)
- `limit` - Itens por página (padrão: 10, máximo: 50)

### **Exemplos:**
```
GET {{categoriesURL}}                    # Listar todas
GET {{categoriesURL}}?q=smart           # Buscar categorias com "smart"
GET {{categoriesURL}}?page=2&limit=5    # Paginação
```

### **Resposta de Sucesso (200):**
```json
{
  "categorias": [
    {
      "id": 1,
      "nome": "Smartphones"
    },
    {
      "id": 2,
      "nome": "Notebooks"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

---

## 🔍 **2. Detalhes da Categoria (Público)**
```
GET {{categoriesURL}}/1
```

### **Resposta de Sucesso (200):**
```json
{
  "categoria": {
    "id": 1,
    "nome": "Smartphones"
  }
}
```

### **Resposta de Erro (404):**
```json
{
  "error": "Categoria não encontrada."
}
```

---

## 🔐 **Rotas Administrativas de Categorias**

### **Base URL:** `{{adminURL}}/categories` = `http://localhost:3333/api/admin/categories`
### **Autenticação:** Bearer Token (Admin apenas)

---

## ➕ **3. Criar Categoria (Admin)**
```
POST {{adminURL}}/categories
```

### **Headers:**
```
Authorization: Bearer {{authToken}}
Content-Type: application/json
```

### **Body:**
```json
{
  "nome": "Smartwatches"
}
```

### **Resposta de Sucesso (201):**
```json
{
  "message": "Categoria criada com sucesso!",
  "categoria": {
    "id": 7,
    "nome": "Smartwatches"
  }
}
```

### **Resposta de Erro (400):**
```json
{
  "error": "Já existe uma categoria com este nome."
}
```

---

## ✏️ **4. Atualizar Categoria (Admin)**
```
PATCH {{adminURL}}/categories/7
```

### **Headers:**
```
Authorization: Bearer {{authToken}}
Content-Type: application/json
```

### **Body:**
```json
{
  "nome": "Relógios Inteligentes"
}
```

### **Resposta de Sucesso (200):**
```json
{
  "message": "Categoria atualizada com sucesso!",
  "categoria": {
    "id": 7,
    "nome": "Relógios Inteligentes"
  }
}
```

---

## 🗑️ **5. Deletar Categoria (Admin)**
```
DELETE {{adminURL}}/categories/7
```

### **Headers:**
```
Authorization: Bearer {{authToken}}
```

### **Resposta de Sucesso (200):**
```json
{
  "message": "Categoria deletada com sucesso!",
  "categoria": "Relógios Inteligentes"
}
```

### **Resposta de Erro (400):**
```json
{
  "error": "Não é possível excluir a categoria. Existem 3 produto(s) vinculado(s) a esta categoria."
}
```

---

## 📊 **6. Estatísticas de Categorias (Admin)**
```
GET {{adminURL}}/categories/stats
```

### **Headers:**
```
Authorization: Bearer {{authToken}}
```

### **Resposta de Sucesso (200):**
```json
{
  "message": "Estatísticas de categorias",
  "stats": {
    "total_categorias": 10,
    "categorias_com_produtos": 5,
    "categorias_sem_produtos": 5,
    "detalhes_por_categoria": [
      {
        "id": 1,
        "nome": "Smartphones",
        "total_produtos": 2
      },
      {
        "id": 2,
        "nome": "Notebooks", 
        "total_produtos": 2
      }
    ]
  }
}
```

---

## 🧪 **Como Testar no Postman**

### **1. Configurar Environment:**
```
categoriesURL = http://localhost:3333/api/public/categories
adminURL = http://localhost:3333/api/admin
```

### **2. Sequência de Testes:**

1. **Listar categorias públicas:**
   ```
   GET {{categoriesURL}}
   ```

2. **Fazer login como admin:**
   ```
   POST {{rota}}/login
   ```

3. **Criar nova categoria:**
   ```
   POST {{adminURL}}/categories
   Body: {"nome": "Nova Categoria"}
   ```

4. **Atualizar categoria:**
   ```
   PATCH {{adminURL}}/categories/ID
   Body: {"nome": "Nome Atualizado"}
   ```

5. **Ver estatísticas:**
   ```
   GET {{adminURL}}/categories/stats
   ```

6. **Deletar categoria:**
   ```
   DELETE {{adminURL}}/categories/ID
   ```

---

## ✅ **Checklist de Funcionalidades**

- [x] ✅ **GET /categories** — Listar todas as categorias (público)
- [x] ✅ **GET /categories/:id** — Detalhes da categoria (público)  
- [x] ✅ **POST /admin/categories** — Criar nova categoria (admin)
- [x] ✅ **PATCH /admin/categories/:id** — Atualizar categoria (admin)
- [x] ✅ **DELETE /admin/categories/:id** — Remover categoria (admin)
- [x] ✅ **GET /admin/categories/stats** — Estatísticas (admin)

## 🚀 **Recursos Adicionais:**

- ✅ Validação com Joi
- ✅ Paginação
- ✅ Busca por nome
- ✅ Proteção contra duplicatas
- ✅ Verificação de produtos vinculados antes de deletar
- ✅ Estatísticas completas
- ✅ Logs detalhados
- ✅ Tratamento de erros
