/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.hasTable('produtos').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('produtos', (table) => {
        table.increments('id').primary();
        table.string('nome', 100).notNullable();
        table.text('descricao');
        table.decimal('preco', 10, 2).notNullable();
        table.integer('estoque').notNullable().defaultTo(0);
        table.string('imagem', 255);
        table.integer('categoria_id').unsigned();
        table.datetime('criado_em').defaultTo(knex.fn.now());
        table.timestamp('atualizado_em').defaultTo(knex.fn.now());
        
        // Índices para melhor performance
        table.index('categoria_id');
        table.index('nome');
      });
    }
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('produtos');
}
