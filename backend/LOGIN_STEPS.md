# 🔑 Testando o Login Passo a Passo

## 1. **REGISTRO (Fazer PRIMEIRO):**
```
POST {{rota}}/register
Content-Type: application/json

{
  "nome": "Teste User",
  "email": "teste@email.com",
  "senha": "123456",
  "tipo": "cliente"
}
```

## 2. **LOGIN (Fazer SEGUNDO - SEM TOKEN!):**
```
POST {{rota}}/login
Content-Type: application/json

{
  "email": "teste@email.com",
  "senha": "123456"
}
```

**Headers do LOGIN (SEM Authorization):**
- Content-Type: application/json

**NÃO COLOQUE Authorization no login!**

## 3. **COPIAR TOKEN da resposta do login:**
O login retorna algo como:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImNsaWVudGUiLCJub21lIjoiVGVzdGUgVXNlciIsImlhdCI6MTY5MjU1NTU1NSwiZXhwIjoxNjkyNjQxOTU1fQ.abc123def456"
}
```

## 4. **USAR TOKEN nas rotas protegidas:**
```
GET {{rota}}/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImNsaWVudGUiLCJub21lIjoiVGVzdGUgVXNlciIsImlhdCI6MTY5MjU1NTU1NSwiZXhwIjoxNjkyNjQxOTU1fQ.abc123def456
```

## ⚠️ **ERRO COMUM:**
- ❌ **NÃO** coloque Authorization no LOGIN
- ❌ **NÃO** precisa de token para fazer login
- ✅ **SÓ** use token DEPOIS do login, nas rotas protegidas
