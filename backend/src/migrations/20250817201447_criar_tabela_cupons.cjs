/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('cupons', function(table) {
    table.increments('id').primary();
    table.string('codigo', 50).notNullable().unique();
    table.enum('tipo', ['percentual', 'valor_fixo']).notNullable();
    table.decimal('valor', 10, 2).notNullable();
    table.date('validade').notNullable();
    table.integer('uso_maximo').notNullable().defaultTo(1);
    table.integer('usado').notNullable().defaultTo(0);
    table.boolean('ativo').notNullable().defaultTo(true);
    table.timestamps(true, true);
    
    // Índices para otimização
    table.index('codigo');
    table.index('ativo');
    table.index('validade');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('cupons');
};
