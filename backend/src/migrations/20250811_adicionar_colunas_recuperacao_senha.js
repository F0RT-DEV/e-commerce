/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.hasColumn('usuarios', 'reset_token').then(function(exists) {
    if (!exists) {
      return knex.schema.alterTable('usuarios', (table) => {
        table.string('reset_token').nullable();
        table.datetime('reset_token_expiry').nullable();
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
    table.dropColumn('reset_token');
    table.dropColumn('reset_token_expiry');
  });
}
