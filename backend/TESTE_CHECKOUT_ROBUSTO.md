# 🧪 Teste do Checkout Robusto - E-commerce

## 📋 **Pré-requisitos**

1. **Servidor rodando** em `http://localhost:3333`
2. **Token de autenticação** válido
3. **Produtos no carrinho**

## 🔑 **1. Obter Token de Autenticação**

```bash
# Login
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "OUltimobr@gmail.com",
    "senha": "2131Douglas"
  }'

# Response esperado:
# {
#   "message": "Login realizado com sucesso",
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "user": { ... }
# }
```

## 🛒 **2. Adicionar Produtos ao Carrinho**

```bash
# Adicionar iPhone 15 Pro (produto_id: 11)
curl -X POST http://localhost:3333/api/client/cart \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "produto_id": 11,
    "quantidade": 2
  }'

# Adicionar Samsung Galaxy S24 (produto_id: 12)
curl -X POST http://localhost:3333/api/client/cart \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "produto_id": 12,
    "quantidade": 1
  }'
```

## 👀 **3. Verificar Carrinho**

```bash
curl -X GET http://localhost:3333/api/client/cart \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json"

# Response esperado:
# {
#   "carrinho": {
#     "itens": [
#       {
#         "produto_id": 11,
#         "nome": "iPhone 15 Pro",
#         "preco": 8999.99,
#         "quantidade": 2,
#         "subtotal": 17999.98
#       },
#       {
#         "produto_id": 12,
#         "nome": "Samsung Galaxy S24",
#         "preco": 4299.99,
#         "quantidade": 1,
#         "subtotal": 4299.99
#       }
#     ],
#     "total_itens": 3,
#     "total": 22299.97
#   }
# }
```

## 💳 **4. Checkout Robusto**

```bash
curl -X POST http://localhost:3333/api/client/cart/checkout \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "shipping_address": {
      "cep": "12345-678",
      "street": "Rua das Flores",
      "number": "123",
      "complement": "Apto 202",
      "neighborhood": "Centro",
      "city": "São Paulo",
      "state": "SP"
    },
    "payment_method": "credit_card",
    "coupon": "DESCONTO10",
    "observacoes": "Entregar após 18h, porteiro João"
  }'
```

## ✅ **Response Esperado do Checkout**

```json
{
  "message": "Compra finalizada com sucesso",
  "pedido": {
    "id": 2,
    "status": "pendente",
    "subtotal": 22299.97,
    "valor_frete": 15.00,
    "valor_desconto": 2229.99,
    "total": 20084.98,
    "metodo_pagamento": "credit_card",
    "endereco_entrega": {
      "cep": "12345678",
      "rua": "Rua das Flores",
      "numero": "123",
      "complemento": "Apto 202",
      "bairro": "Centro",
      "cidade": "São Paulo",
      "estado": "SP"
    },
    "cupom_usado": "DESCONTO10",
    "observacoes": "Entregar após 18h, porteiro João"
  }
}
```

## 🧮 **Cálculo Demonstrado**

```
Subtotal dos produtos: R$ 22.299,97
+ Frete:              R$     15,00
- Desconto (10%):     R$  2.229,99
= Total final:        R$ 20.084,98
```

## 🏷️ **Métodos de Pagamento Aceitos**

- `credit_card` - Cartão de Crédito
- `debit_card` - Cartão de Débito  
- `pix` - PIX
- `boleto` - Boleto Bancário

## 🎟️ **Cupons de Desconto**

- `DESCONTO10` - 10% de desconto no subtotal
- *Outros cupons podem ser implementados facilmente*

## 🗂️ **Verificar Pedido no Banco**

```sql
-- Ver pedido criado
SELECT * FROM pedidos WHERE id = 2;

-- Ver itens do pedido
SELECT pi.*, p.nome 
FROM pedido_itens pi 
JOIN produtos p ON pi.produto_id = p.id 
WHERE pi.pedido_id = 2;
```

## 🚨 **Casos de Erro**

### **CEP Inválido:**
```json
{
  "error": "Dados inválidos",
  "details": "CEP deve estar no formato 12345-678 ou 12345678"
}
```

### **Método de Pagamento Inválido:**
```json
{
  "error": "Dados inválidos",
  "details": "Método de pagamento deve ser: credit_card, debit_card, pix ou boleto"
}
```

### **Carrinho Vazio:**
```json
{
  "error": "Carrinho vazio"
}
```

### **Estoque Insuficiente:**
```json
{
  "error": "Erro ao finalizar compra",
  "message": "Estoque insuficiente. Disponível: 5 unidades de iPhone 15 Pro"
}
```

---

## 🎯 **Próximos Passos para Melhorar**

1. **API de CEP** - Integrar com ViaCEP para validar endereços
2. **Cálculo de Frete** - Integrar com Correios/transportadoras
3. **Sistema de Cupons** - Criar tabela de cupons no banco
4. **Gateway de Pagamento** - Integrar com Stripe/PagSeguro
5. **Notificações** - Email/SMS de confirmação do pedido
6. **Relatórios** - Dashboard de vendas e pedidos

**O checkout robusto está 100% funcional! 🚀**
