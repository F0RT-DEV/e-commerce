/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('notificacoes', table => {
    table.increments('id').primary();
    table.integer('usuario_id').unsigned().notNullable();
    table.string('titulo', 100).notNullable();
    table.text('mensagem').notNullable();
    table.enum('tipo', ['sistema', 'promocao', 'pedido', 'geral']).defaultTo('geral');
    table.boolean('lida').defaultTo(false);
    table.timestamp('criado_em').defaultTo(knex.fn.now());
    table.timestamp('atualizado_em').defaultTo(knex.fn.now());
    
    // Foreign key
    table.foreign('usuario_id').references('id').inTable('usuarios').onDelete('CASCADE');
    
    // Índices
    table.index('usuario_id');
    table.index('lida');
    table.index('tipo');
    table.index('criado_em');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('notificacoes');
};
