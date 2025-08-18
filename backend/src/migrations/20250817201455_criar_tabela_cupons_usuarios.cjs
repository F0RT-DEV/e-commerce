/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('cupons_usuarios', function(table) {
    table.increments('id').primary();
    table.integer('cupom_id').unsigned().notNullable();
    table.integer('usuario_id').unsigned().notNullable();
    table.datetime('usado_em').notNullable();
    table.timestamps(true, true);
    
    // Chaves estrangeiras
    table.foreign('cupom_id').references('id').inTable('cupons').onDelete('CASCADE');
    table.foreign('usuario_id').references('id').inTable('usuarios').onDelete('CASCADE');
    
    // Índices para otimização
    table.index('cupom_id');
    table.index('usuario_id');
    table.index('usado_em');
    
    // Previne uso duplo do mesmo cupom pelo mesmo usuário
    table.unique(['cupom_id', 'usuario_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('cupons_usuarios');
};
