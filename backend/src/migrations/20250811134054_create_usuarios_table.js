/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('usuarios', function(table) {
    table.increments('id').primary();
    table.string('nome', 255).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('senha', 255).notNullable();
    table.enum('role', ['cliente', 'admin']).defaultTo('cliente');
    table.string('telefone', 20);
    table.text('endereco');
    table.boolean('ativo').defaultTo(true);
    table.timestamp('criado_em').defaultTo(knex.fn.now());
    table.timestamp('atualizado_em').defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('usuarios');
}
