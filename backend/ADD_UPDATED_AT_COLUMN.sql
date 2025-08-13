-- 🔧 Adicionar coluna atualizado_em na tabela produtos
-- Execute no MySQL Workbench/phpMyAdmin

USE ecommerce_db;

-- Adicionar coluna atualizado_em se não existir
ALTER TABLE produtos 
ADD COLUMN IF NOT EXISTS atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
AFTER criado_em;

-- Verificar estrutura da tabela
DESCRIBE produtos;

-- Atualizar produtos existentes com a data atual
UPDATE produtos 
SET atualizado_em = criado_em 
WHERE atualizado_em IS NULL;
