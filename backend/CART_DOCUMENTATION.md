# 🛒 Sistema de Carrinho - Documentação

## 📋 **Visão Geral**

O carrinho foi implementado **sem tabela no banco** usando **sessões temporárias**. Quando o cliente finaliza a compra, o carrinho é convertido em um **pedido** nas tabelas `pedidos` e `pedido_itens`.

## 🎯 **Fluxo do Carrinho**

```
1. 👤 Cliente faz login → Sessão criada
2. 🛒 Adiciona produtos → Carrinho em memória (sessão)
3. ✏️ Atualiza quantidades → Validação de estoque
4. 👀 Visualiza carrinho → Cálculo de totais
5. 💳 Finaliza compra → Cria pedido no banco
6. 🧹 Carrinho limpo → Sessão resetada
```

## 🌐 **Rotas Disponíveis**

### **Base URL:** `{{clientURL}}/cart` = `http://localhost:3333/api/client/cart`

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/` | Visualizar carrinho | ✅ |
| `POST` | `/` | Adicionar produto | ✅ |
| `PATCH` | `/:produto_id` | Atualizar quantidade | ✅ |
| `DELETE` | `/:produto_id` | Remover item | ✅ |
| `DELETE` | `/` | Limpar carrinho | ✅ |
| `POST` | `/checkout` | Finalizar compra | ✅ |

## 📝 **Exemplos de Request/Response**

### **1. Adicionar Produto ao Carrinho**
```bash
POST {{clientURL}}/cart
Authorization: Bearer {{authToken}}
Content-Type: application/json

{
  "produto_id": 1,
  "quantidade": 2
}
```

**Response:**
```json
{
  "message": "Produto adicionado ao carrinho",
  "produto": "iPhone 16 Pro Max",
  "quantidade": 2,
  "carrinho": {
    "itens": [
      {
        "produto_id": 1,
        "nome": "iPhone 16 Pro Max",
        "preco": 11999.99,
        "quantidade": 2,
        "imagem": "https://example.com/iphone.jpg",
        "subtotal": 23999.98
      }
    ],
    "total_itens": 2,
    "total": 23999.98
  }
}
```

### **2. Visualizar Carrinho**
```bash
GET {{clientURL}}/cart
Authorization: Bearer {{authToken}}
```

**Response:**
```json
{
  "carrinho": {
    "itens": [
      {
        "produto_id": 1,
        "nome": "iPhone 16 Pro Max",
        "preco": 11999.99,
        "quantidade": 2,
        "subtotal": 23999.98
      }
    ],
    "total_itens": 2,
    "total": 23999.98
  },
  "isEmpty": false
}
```

### **3. Atualizar Quantidade**
```bash
PATCH {{clientURL}}/cart/1
Authorization: Bearer {{authToken}}
Content-Type: application/json

{
  "quantidade": 3
}
```

### **4. Remover Item**
```bash
DELETE {{clientURL}}/cart/1
Authorization: Bearer {{authToken}}
```

### **5. Finalizar Compra - Formato Robusto**
```bash
POST {{clientURL}}/cart/checkout
Authorization: Bearer {{authToken}}
Content-Type: application/json

{
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
  "observacoes": "Entregar após 18h"
}
```

**Response:**
```json
{
  "message": "Compra finalizada com sucesso",
  "pedido": {
    "id": 15,
    "status": "pendente",
    "subtotal": 208.80,
    "valor_frete": 15.00,
    "valor_desconto": 20.88,
    "total": 202.92,
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
    "observacoes": "Entregar após 18h"
  }
}
```

### **5.1. Formato Simples (Legado - Ainda Funciona)**
```bash
POST {{clientURL}}/cart/checkout
Authorization: Bearer {{authToken}}
Content-Type: application/json

{
  "endereco_entrega": "Rua das Flores, 123 - Centro",
  "observacoes": "Entregar após 18h"
}
```

## ⚙️ **Validações Implementadas**

### **Produto:**
- ✅ Produto deve existir
- ✅ Produto deve ter estoque disponível
- ✅ Quantidade máxima: 99 unidades

### **Estoque:**
- ✅ Verifica estoque antes de adicionar
- ✅ Verifica estoque ao atualizar quantidade
- ✅ Reduz estoque apenas no checkout

### **Carrinho:**
- ✅ Impede duplicação (soma quantidades)
- ✅ Cálculo automático de subtotais
- ✅ Cálculo automático do total

### **Checkout - Endereço:**
- ✅ CEP no formato 12345-678 ou 12345678
- ✅ Rua (mín. 5, máx. 255 caracteres)
- ✅ Número obrigatório (máx. 20 caracteres)
- ✅ Complemento opcional (máx. 100 caracteres)
- ✅ Bairro (mín. 2, máx. 100 caracteres)
- ✅ Cidade (mín. 2, máx. 100 caracteres)
- ✅ Estado com exatamente 2 caracteres (SP, RJ, etc.)

### **Checkout - Pagamento:**
- ✅ Métodos aceitos: credit_card, debit_card, pix, boleto
- ✅ Cupom de desconto opcional (3-50 caracteres)
- ✅ Observações opcionais (máx. 300 caracteres)

### **Checkout - Cálculos:**
- ✅ Subtotal dos produtos
- ✅ Frete fixo de R$ 15,00 (por enquanto)
- ✅ Desconto para cupom "DESCONTO10" (10%)
- ✅ Total = Subtotal + Frete - Desconto

## 🔧 **Configuração Técnica**

### **Sessão:**
```javascript
session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
})
```

### **Estrutura da Sessão:**
```javascript
req.session.cart = [
  {
    produto_id: 1,
    nome: "iPhone 16 Pro Max",
    preco: 11999.99,
    quantidade: 2,
    imagem: "https://example.com/iphone.jpg"
  }
]
```

## 🚨 **Limitações Atuais**

1. **Carrinho não persiste** entre sessões diferentes
2. **Sem carrinho abandonado** (analytics)
3. **Sem sincronização** entre dispositivos
4. **Sessão expira** em 24h

## 🔄 **Integração com Pedidos**

Quando o checkout é executado:

1. **Valida estoque** de todos os itens
2. **Processa cupom** de desconto (se fornecido)
3. **Calcula frete** (fixo R$ 15,00 por enquanto)
4. **Cria pedido** na tabela `pedidos` com:
   - Dados do usuário
   - Subtotal, desconto, frete e total
   - Endereço completo de entrega
   - Método de pagamento
   - Cupom usado e observações
5. **Cria itens** na tabela `pedido_itens`  
6. **Reduz estoque** dos produtos
7. **Limpa carrinho** da sessão
8. **Retorna dados** completos do pedido

### **Estrutura do Pedido no Banco:**
```sql
pedidos:
- id, usuario_id, status
- subtotal, valor_desconto, valor_frete, total  
- endereco_cep, endereco_rua, endereco_numero
- endereco_complemento, endereco_bairro, endereco_cidade, endereco_estado
- metodo_pagamento, codigo_cupom, observacoes
- criado_em

pedido_itens:
- id, pedido_id, produto_id
- quantidade, preco_unitario
```

## 📊 **Próximas Melhorias**

- [ ] Carrinho persistente no banco
- [ ] Carrinho para usuários não logados
- [ ] Sincronização multi-dispositivo
- [ ] Analytics de carrinho abandonado
- [ ] Cupons de desconto
- [ ] Frete calculado

## 🧪 **Como Testar**

1. **Faça login** para obter token
2. **Adicione produtos** ao carrinho
3. **Visualize** o carrinho
4. **Atualize quantidades**
5. **Finalize** a compra
6. **Verifique** se o pedido foi criado

## ✅ **Status de Implementação**

- ✅ **Adicionar produtos** - Funcionando
- ✅ **Visualizar carrinho** - Funcionando  
- ✅ **Atualizar quantidades** - Funcionando
- ✅ **Remover itens** - Funcionando
- ✅ **Limpar carrinho** - Funcionando
- ✅ **Finalizar compra** - Funcionando
- ✅ **Validação de estoque** - Funcionando
- ✅ **Cálculo de totais** - Funcionando

**O carrinho está 100% funcional e pronto para uso!** 🚀
