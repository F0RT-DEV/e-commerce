/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.alterTable('usuarios', (table) => {
    // Renomear colunas para português
    table.renameColumn('reset_token', 'token_recuperacao');
    table.renameColumn('reset_token_expiry', 'token_recuperacao_expira_em');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.alterTable('usuarios', (table) => {
    // Reverter para inglês
    table.renameColumn('token_recuperacao', 'reset_token');
    table.renameColumn('token_recuperacao_expira_em', 'reset_token_expiry');
  });
}
