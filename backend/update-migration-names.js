// 🔧 Script para atualizar nomes das migrations no banco
// Execute: node update-migration-names.js

import knex from 'knex';
import knexConfig from './knexfile.js';

const db = knex(knexConfig.development);

async function updateMigrationNames() {
  try {
    console.log('🔄 Atualizando nomes das migrations...');

    // Atualizar cada migration
    await db('migracoes_knex')
      .where('name', '20250811134054_create_usuarios_table.js')
      .update({ name: '20250811134054_criar_tabela_usuarios.js' });

    await db('migracoes_knex')
      .where('name', '20250811_add_reset_password_columns.js')
      .update({ name: '20250811_adicionar_colunas_recuperacao_senha.js' });

    await db('migracoes_knex')
      .where('name', '20250812223910_add_updated_at_column.js')
      .update({ name: '20250812223910_adicionar_coluna_atualizado_em.js' });

    await db('migracoes_knex')
      .where('name', '20250813144719_rename_columns_to_portuguese.js')
      .update({ name: '20250813144719_renomear_colunas_para_portugues.js' });

    console.log('✅ Nomes das migrations atualizados com sucesso!');
    
    // Verificar resultado
    const migrations = await db('migracoes_knex').select('*');
    console.log('📋 Migrations atuais:');
    migrations.forEach(m => console.log(`  - ${m.name}`));

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await db.destroy();
  }
}

updateMigrationNames();
