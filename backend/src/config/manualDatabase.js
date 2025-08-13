// 🗃️ CONFIGURAÇÃO DE BANCO SEM MIGRATIONS
// Arquivo: src/config/manualDatabase.js

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root', 
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'ecommerce_db'
};

// 🔧 Função para verificar e criar tabelas se necessário
export async function setupDatabaseManual() {
  try {
    console.log('🔍 Verificando estrutura do banco...');
    
    const connection = await mysql.createConnection(dbConfig);
    
    // Verificar se tabela usuarios existe
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'usuarios'"
    );
    
    if (tables.length === 0) {
      console.log('📦 Criando tabela usuarios...');
      
      await connection.execute(`
        CREATE TABLE usuarios (
          id INT(11) NOT NULL AUTO_INCREMENT,
          nome VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL UNIQUE,
          senha VARCHAR(255) NOT NULL,
          endereco TEXT,
          telefone VARCHAR(20),
          tipo ENUM('cliente', 'admin') NOT NULL DEFAULT 'cliente',
          reset_token VARCHAR(255) NULL,
          reset_token_expiry DATETIME NULL,
          criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        )
      `);
      
      console.log('✅ Tabela usuarios criada com sucesso!');
    } else {
      console.log('✅ Tabela usuarios já existe');
      
      // Verificar se colunas extras existem
      const [columns] = await connection.execute(
        "DESCRIBE usuarios"
      );
      
      const columnNames = columns.map(col => col.Field);
      
      // Adicionar reset_token se não existir
      if (!columnNames.includes('reset_token')) {
        await connection.execute(
          "ALTER TABLE usuarios ADD COLUMN reset_token VARCHAR(255) NULL"
        );
        console.log('➕ Coluna reset_token adicionada');
      }
      
      // Adicionar reset_token_expiry se não existir  
      if (!columnNames.includes('reset_token_expiry')) {
        await connection.execute(
          "ALTER TABLE usuarios ADD COLUMN reset_token_expiry DATETIME NULL"
        );
        console.log('➕ Coluna reset_token_expiry adicionada');
      }
      
      // Adicionar atualizado_em se não existir
      if (!columnNames.includes('atualizado_em')) {
        await connection.execute(`
          ALTER TABLE usuarios 
          ADD COLUMN atualizado_em TIMESTAMP 
          DEFAULT CURRENT_TIMESTAMP 
          ON UPDATE CURRENT_TIMESTAMP
        `);
        console.log('➕ Coluna atualizado_em adicionada');
      }
    }
    
    await connection.end();
    console.log('🎯 Banco configurado sem migrations!');
    
  } catch (error) {
    console.error('❌ Erro ao configurar banco:', error);
  }
}

// 🧹 Função para limpar migrations do Knex (opcional)
export async function removeMigrationTables() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.execute("DROP TABLE IF EXISTS knex_migrations_lock");
    await connection.execute("DROP TABLE IF EXISTS knex_migrations");
    
    console.log('🗑️ Tabelas de migration removidas');
    await connection.end();
  } catch (error) {
    console.error('❌ Erro ao remover migrations:', error);
  }
}
