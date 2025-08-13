# Documentação das APIs de Autenticação

## Rotas Implementadas

### 1. POST /api/auth/register
Registra um novo usuário no sistema.

**Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456",
  "telefone": "11999999999",
  "endereco": "Rua das Flores, 123",
  "tipo": "cliente"
}
```

**Resposta de Sucesso (201):**
```json
{
  "message": "Usuário criado com sucesso!"
}
```

### 2. POST /api/auth/login
Autentica um usuário e retorna um token JWT.

**Body:**
```json
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

**Resposta de Sucesso (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. GET /api/auth/me
Retorna os dados do usuário autenticado. **Requer autenticação.**

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta de Sucesso (200):**
```json
{
  "user": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "11999999999",
    "endereco": "Rua das Flores, 123",
    "tipo": "cliente",
    "criado_em": "2025-08-11T16:00:00.000Z"
  }
}
```

### 4. PATCH /api/auth/me
Atualiza os dados do perfil do usuário. **Requer autenticação.**

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "nome": "João Santos",
  "telefone": "11888888888",
  "endereco": "Rua Nova, 456"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Perfil atualizado com sucesso!",
  "user": {
    "id": 1,
    "nome": "João Santos",
    "email": "joao@email.com",
    "telefone": "11888888888",
    "endereco": "Rua Nova, 456",
    "tipo": "cliente",
    "criado_em": "2025-08-11T16:00:00.000Z"
  }
}
```

### 5. PATCH /api/auth/me/password
Atualiza a senha do usuário. **Requer autenticação.**

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "senhaAtual": "123456",
  "novaSenha": "novaSenh@123",
  "confirmarSenha": "novaSenh@123"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Senha atualizada com sucesso!"
}
```

### 6. PATCH /api/auth/me/email
Atualiza o email do usuário. **Requer autenticação.**

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "novoEmail": "novo@email.com",
  "senha": "123456"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "E-mail atualizado com sucesso!"
}
```

### 7. DELETE /api/auth/me
Deleta a conta do usuário. **Requer autenticação.**

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "senha": "123456",
  "confirmacao": "DELETE"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Conta deletada com sucesso!"
}
```

### 8. GET /api/auth/me/stats
Retorna estatísticas do usuário. **Requer autenticação.**

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta de Sucesso (200):**
```json
{
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "tipo": "cliente",
    "criado_em": "2025-08-11T16:00:00.000Z"
  }
}
```

### 9. POST /api/auth/forgot-password
Gera um token de recuperação de senha.

**Body:**
```json
{
  "email": "joao@email.com"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Token de recuperação gerado com sucesso.",
  "resetToken": "a1b2c3d4e5f6...",
  "expiresIn": "1 hora"
}
```

> ⚠️ **Nota:** O campo `resetToken` é retornado apenas para testes. Em produção, este token deve ser enviado por e-mail.

### 10. POST /api/auth/reset-password
Redefine a senha do usuário usando um token de recuperação.

**Body:**
```json
{
  "token": "a1b2c3d4e5f6...",
  "novaSenha": "novaSenha123"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Senha redefinida com sucesso!"
}
```

## Códigos de Erro

- **400**: Dados inválidos (validação falhou)
- **401**: Não autorizado (token inválido ou senha incorreta)
- **403**: Token inválido ou expirado
- **404**: Usuário não encontrado
- **409**: E-mail já cadastrado
- **500**: Erro interno do servidor

## Exemplo de Uso com cURL

### Registrar usuário:
```bash
curl -X POST http://localhost:3333/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "senha": "123456",
    "tipo": "cliente"
  }'
```

### Login:
```bash
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "senha": "123456"
  }'
```

### Obter dados do usuário:
```bash
curl -X GET http://localhost:3333/api/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Solicitar recuperação de senha:
```bash
curl -X POST http://localhost:3333/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com"
  }'
```

### Redefinir senha:
```bash
curl -X POST http://localhost:3333/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "TOKEN_DE_RECUPERACAO",
    "novaSenha": "novaSenha123"
  }'
```
