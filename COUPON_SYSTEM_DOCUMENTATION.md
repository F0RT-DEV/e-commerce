# 🎟️ Sistema de Cupons - Documentação Completa

## 📋 **Visão Geral**

O sistema de cupons permite que administradores criem e gerenciem cupons de desconto, e que clientes apliquem esses cupons em suas compras para obter descontos.

### **Funcionalidades Implementadas:**
- ✅ Criação e gestão de cupons (Admin)
- ✅ Aplicação de cupons no carrinho
- ✅ Validação de cupons (data, uso, disponibilidade)
- ✅ Registro de uso de cupons
- ✅ Estatísticas de cupons
- ✅ Integração com checkout

---

## 🗃️ **Estrutura do Banco de Dados**

### **Tabela: `cupons`**
```sql
CREATE TABLE `cupons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) NOT NULL UNIQUE,
  `tipo` enum('percentual','valor_fixo') NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `validade` date NOT NULL,
  `uso_maximo` int(11) NOT NULL DEFAULT 1,
  `usado` int(11) NOT NULL DEFAULT 0,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `codigo` (`codigo`),
  KEY `ativo` (`ativo`),
  KEY `validade` (`validade`)
);
```

### **Tabela: `cupons_usuarios`**
```sql
CREATE TABLE `cupons_usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cupom_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `usado_em` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cupom_usuario_unique` (`cupom_id`,`usuario_id`),
  KEY `cupom_id` (`cupom_id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `usado_em` (`usado_em`),
  FOREIGN KEY (`cupom_id`) REFERENCES `cupons` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
);
```

---

## 🛣️ **Rotas da API**

### **🔐 Rotas de Administração - `/api/admin/coupons`**

#### **POST** `/api/admin/coupons` - Criar Cupom
```json
{
  "codigo": "DESCONTO10",
  "tipo": "percentual",
  "valor": 10,
  "validade": "2025-12-31",
  "uso_maximo": 100,
  "ativo": true
}
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Cupom criado com sucesso",
  "data": {
    "cupom": {
      "id": 1,
      "codigo": "DESCONTO10",
      "tipo": "percentual",
      "valor": 10,
      "validade": "2025-12-31",
      "uso_maximo": 100,
      "usado": 0,
      "ativo": true,
      "disponivel": true,
      "created_at": "2025-08-17T20:30:00.000Z",
      "updated_at": "2025-08-17T20:30:00.000Z"
    }
  }
}
```

#### **GET** `/api/admin/coupons` - Listar Cupons
**Query Parameters:**
- `page` (opcional): Página (default: 1)
- `limit` (opcional): Itens por página (default: 10, max: 100)
- `tipo` (opcional): 'percentual' ou 'valor_fixo'
- `ativo` (opcional): true/false
- `search` (opcional): Busca por código
- `sort` (opcional): 'codigo', 'valor', 'validade', 'created_at'
- `order` (opcional): 'asc' ou 'desc'

#### **GET** `/api/admin/coupons/:id` - Buscar Cupom por ID

#### **PUT/PATCH** `/api/admin/coupons/:id` - Atualizar Cupom

#### **DELETE** `/api/admin/coupons/:id` - Deletar Cupom

#### **GET** `/api/admin/coupons/stats` - Estatísticas de Cupons
```json
{
  "success": true,
  "message": "Estatísticas obtidas com sucesso",
  "data": {
    "estatisticas": {
      "total": 15,
      "ativos": 12,
      "inativos": 3,
      "expirados": 2,
      "esgotados": 1,
      "total_usos": 45,
      "cupons_populares": [
        {
          "codigo": "DESCONTO20",
          "usado": 15,
          "uso_maximo": 20
        }
      ]
    }
  }
}
```

### **🌐 Rotas Públicas - `/api/coupons`**

#### **GET** `/api/coupons` - Listar Cupons Ativos
```json
{
  "success": true,
  "message": "Cupons ativos listados com sucesso",
  "data": {
    "cupons": [
      {
        "codigo": "DESCONTO10",
        "tipo": "percentual",
        "valor": 10,
        "validade": "2025-12-31"
      }
    ]
  }
}
```

#### **POST** `/api/coupons/verify` - Verificar Cupom
```json
{
  "codigo": "DESCONTO10"
}
```

### **🛒 Rotas do Carrinho - `/api/client/cart`**

#### **POST** `/api/client/cart/apply-coupon` - Aplicar Cupom ao Carrinho
```json
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
      "desconto": 25.50
    },
    "carrinho": {
      "total_original": 255.00,
      "desconto": 25.50,
      "total_final": 229.50
    }
  }
}
```

#### **DELETE** `/api/client/cart/remove-coupon` - Remover Cupom do Carrinho

---

## 🔧 **Tipos de Cupons**

### **1. Cupom Percentual**
- Desconto em porcentagem sobre o total do carrinho
- Valor máximo: 100%
- Exemplo: 10% de desconto

### **2. Cupom Valor Fixo**
- Desconto em valor monetário fixo
- Não pode exceder o valor total do carrinho
- Exemplo: R$ 50,00 de desconto

---

## 📝 **Validações de Cupons**

### **Critérios de Validação:**
1. ✅ **Código existe** - O cupom deve existir no banco
2. ✅ **Ativo** - O cupom deve estar ativo
3. ✅ **Não expirado** - Data de validade deve ser futura
4. ✅ **Não esgotado** - Uso atual < uso máximo
5. ✅ **Não usado pelo usuário** - Usuário não pode reusar o mesmo cupom

### **Regras de Aplicação:**
- ✅ Um cupom por carrinho
- ✅ Cupom aplicado permanece na sessão até checkout ou remoção
- ✅ Desconto calculado automaticamente
- ✅ Registro de uso apenas no checkout bem-sucedido

---

## 🛒 **Integração com Carrinho e Checkout**

### **Fluxo de Aplicação de Cupom:**
1. Cliente adiciona produtos ao carrinho
2. Cliente aplica cupom via `/api/client/cart/apply-coupon`
3. Sistema valida cupom
4. Desconto é calculado e aplicado ao carrinho
5. Carrinho exibe total original, desconto e total final
6. No checkout, cupom é registrado como usado

### **Estrutura do Carrinho com Cupom:**
```json
{
  "carrinho": {
    "itens": [...],
    "total_itens": 3,
    "subtotal": 255.00,
    "total": 255.00,
    "cupom": {
      "codigo": "DESCONTO10",
      "tipo": "percentual",
      "valor": 10,
      "desconto": 25.50
    },
    "total_com_desconto": 229.50,
    "desconto_aplicado": 25.50
  }
}
```

---

## 🔍 **Casos de Uso**

### **Administrador:**
1. **Criar cupom promocional**
   - Definir código, tipo, valor e validade
   - Configurar limite de uso
   - Ativar/desativar cupom

2. **Gerenciar cupons existentes**
   - Visualizar lista de cupons
   - Editar informações
   - Desativar cupons expirados

3. **Acompanhar estatísticas**
   - Cupons mais utilizados
   - Total de descontos concedidos
   - Cupons expirados/esgotados

### **Cliente:**
1. **Descobrir cupons disponíveis**
   - Visualizar cupons ativos
   - Verificar validade

2. **Aplicar cupom no carrinho**
   - Inserir código do cupom
   - Ver desconto aplicado
   - Finalizar compra com desconto

---

## 🧪 **Testes Recomendados**

### **Testes de Criação de Cupons:**
```bash
# Criar cupom percentual
curl -X POST http://localhost:3333/api/admin/coupons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {admin_token}" \
  -d '{
    "codigo": "DESCONTO10",
    "tipo": "percentual",
    "valor": 10,
    "validade": "2025-12-31",
    "uso_maximo": 100
  }'

# Criar cupom valor fixo
curl -X POST http://localhost:3333/api/admin/coupons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {admin_token}" \
  -d '{
    "codigo": "DESCONTO50",
    "tipo": "valor_fixo",
    "valor": 50,
    "validade": "2025-12-31",
    "uso_maximo": 50
  }'
```

### **Testes de Aplicação de Cupom:**
```bash
# Aplicar cupom ao carrinho
curl -X POST http://localhost:3333/api/client/cart/apply-coupon \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {user_token}" \
  -d '{
    "codigo": "DESCONTO10"
  }'

# Verificar carrinho com cupom
curl -X GET http://localhost:3333/api/client/cart \
  -H "Authorization: Bearer {user_token}"
```

---

## 📊 **Métricas e Monitoramento**

### **KPIs do Sistema:**
- Total de cupons criados
- Taxa de utilização de cupons
- Valor total de descontos concedidos
- Cupons mais populares
- Cupons expirados não utilizados

### **Logs Importantes:**
- ✅ Criação de cupons
- ✅ Aplicação de cupons
- ✅ Tentativas de uso de cupons inválidos
- ✅ Registro de uso no checkout

---

## 🚀 **Próximas Melhorias**

### **Funcionalidades Futuras:**
- [ ] Cupons automáticos por valor mínimo de compra
- [ ] Cupons específicos por categoria de produto
- [ ] Cupons personalizados por usuário
- [ ] Cupons com limite por usuário
- [ ] Sistema de cupons em cascata
- [ ] Cupons de frete grátis
- [ ] Notificações de cupons próximos ao vencimento

---

## ✅ **Status de Implementação**

### **Completo:** ✅
- Sistema de criação e gestão de cupons
- Validação completa de cupons
- Aplicação no carrinho
- Integração com checkout
- Registro de uso
- Estatísticas básicas
- Rotas de administração
- Documentação da API

### **Testado:** ✅
- Todas as rotas implementadas
- Validações de entrada
- Casos de erro
- Integração entre módulos

O sistema de cupons está **100% funcional** e pronto para uso em produção! 🎉
