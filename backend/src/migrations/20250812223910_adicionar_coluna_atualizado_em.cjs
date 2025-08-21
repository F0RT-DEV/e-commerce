/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.hasColumn('usuarios', 'atualizado_em').then(function(exists) {
    if (!exists) {
      return knex.schema.alterTable('usuarios', (table) => {
        table.timestamp('atualizado_em').defaultTo(knex.fn.now());
      });
    }
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.alterTable('usuarios', (table) => {
    table.dropColumn('atualizado_em');
  });
}
