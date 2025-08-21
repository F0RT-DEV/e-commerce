import knex from 'knex';
import knexConfig from './knexfile.js';

const db = knex(knexConfig.development);

async function createAvaliacoesTable() {
  try {
    console.log('🔍 Verificando se a tabela avaliacoes existe...');
    
    const hasTable = await db.schema.hasTable('avaliacoes');
    
    if (hasTable) {
      console.log('✅ Tabela avaliacoes já existe!');
    } else {
      console.log('⚠️  Tabela avaliacoes não existe. Criando...');
      
      await db.schema.createTable('avaliacoes', table => {
        table.increments('id').primary();
        table.integer('produto_id').unsigned().notNullable();
        table.integer('usuario_id').unsigned().notNullable();
        table.integer('nota').notNullable();
        table.text('comentario');
        table.timestamp('criado_em').defaultTo(db.fn.now());
        
        // Foreign keys
        table.foreign('produto_id').references('id').inTable('produtos').onDelete('CASCADE');
        table.foreign('usuario_id').references('id').inTable('usuarios').onDelete('CASCADE');
        
        // Índices
        table.index('produto_id');
        table.index('usuario_id');
        table.index('nota');
        table.index('criado_em');
        
        // Restrição: 1 avaliação por produto por usuário
        table.unique(['produto_id', 'usuario_id']);
      });
      
      console.log('✅ Tabela avaliacoes criada com sucesso!');
    }
    
    // Mostrar estrutura atual
    const columns = await db.raw("SHOW COLUMNS FROM avaliacoes");
    console.log('📋 Estrutura da tabela avaliacoes:');
    console.table(columns[0]);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

createAvaliacoesTable();
