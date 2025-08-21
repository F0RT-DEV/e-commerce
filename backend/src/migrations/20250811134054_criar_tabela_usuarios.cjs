/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.hasTable('usuarios').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('usuarios', (table) => {
        table.increments('id').primary();
        table.string('nome', 100).notNullable();
        table.string('email').notNullable().unique();
        table.string('senha').notNullable();
        table.string('telefone', 20).nullable();
        table.text('endereco').nullable();
        table.enum('tipo', ['cliente', 'admin']).notNullable().defaultTo('cliente');
        table.string('reset_token').nullable();
        table.datetime('reset_token_expiry').nullable();
        table.timestamp('criado_em').defaultTo(knex.fn.now());
        table.timestamp('atualizado_em').defaultTo(knex.fn.now());
      });
    } else {
      // Se a tabela já existe, vamos adicionar as colunas de reset se não existirem
      return knex.schema.hasColumn('usuarios', 'reset_token').then(function(hasResetToken) {
        if (!hasResetToken) {
          return knex.schema.alterTable('usuarios', (table) => {
            table.string('reset_token').nullable();
            table.datetime('reset_token_expiry').nullable();
          });
        }
      });
    }
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('usuarios');
}
