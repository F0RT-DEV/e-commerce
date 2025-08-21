export const up = function(knex) {
  return knex.schema.table('pedidos', function(table) {
    // Endereço de entrega
    table.string('endereco_cep', 9);
    table.string('endereco_rua', 255);
    table.string('endereco_numero', 20);
    table.string('endereco_complemento', 100);
    table.string('endereco_bairro', 100);
    table.string('endereco_cidade', 100);
    table.string('endereco_estado', 2);
    
    // Observações e informações adicionais
    table.text('observacoes');
    table.string('metodo_pagamento', 50);
    table.string('codigo_cupom', 50);
    table.decimal('valor_desconto', 10, 2).defaultTo(0);
    table.decimal('valor_frete', 10, 2).defaultTo(0);
    table.decimal('subtotal', 10, 2);
    
    // Índices para consultas
    table.index('endereco_cep');
    table.index('metodo_pagamento');
    table.index('codigo_cupom');
  });
};

export const down = function(knex) {
  return knex.schema.table('pedidos', function(table) {
    table.dropColumn([
      'endereco_cep',
      'endereco_rua', 
      'endereco_numero',
      'endereco_complemento',
      'endereco_bairro',
      'endereco_cidade',
      'endereco_estado',
      'observacoes',
      'metodo_pagamento',
      'codigo_cupom',
      'valor_desconto',
      'valor_frete',
      'subtotal'
    ]);
  });
};
