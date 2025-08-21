/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('avaliacoes', table => {
    table.increments('id').primary();
    table.integer('produto_id').unsigned().notNullable();
    table.integer('usuario_id').unsigned().notNullable();
    table.integer('nota').notNullable().checkIn([1, 2, 3, 4, 5]);
    table.text('comentario');
    table.timestamp('criado_em').defaultTo(knex.fn.now());
    
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
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('avaliacoes');
};
