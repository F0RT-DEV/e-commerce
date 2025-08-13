import db from "../../db.js";

// 📋 Listar produtos com filtros e paginação
export const getProducts = async (filters = {}) => {
  const { categoria_id, search, q, preco_min, preco_max, page = 1, limit = 10 } = filters;
  const searchTerm = q || search; // Aceita tanto 'q' quanto 'search'
  const offset = (page - 1) * limit;

  let query = db('produtos')
    .select('*')
    .where('estoque', '>', 0) // Apenas produtos em estoque
    .orderBy('criado_em', 'desc');

  // Filtros opcionais
  if (categoria_id) {
    query = query.where('categoria_id', categoria_id);
  }

  if (searchTerm) {
    query = query.where(function() {
      this.where('nome', 'like', `%${searchTerm}%`)
          .orWhere('descricao', 'like', `%${searchTerm}%`);
    });
  }

  if (preco_min) {
    query = query.where('preco', '>=', preco_min);
  }

  if (preco_max) {
    query = query.where('preco', '<=', preco_max);
  }

  // Paginação
  query = query.limit(limit).offset(offset);

  return await query;
};

// 📊 Contar total de produtos (para paginação)
export const countProducts = async (filters = {}) => {
  const { categoria_id, search, q, preco_min, preco_max } = filters;
  const searchTerm = q || search; // Aceita tanto 'q' quanto 'search'

  let query = db('produtos')
    .count('id as total')
    .where('estoque', '>', 0);

  // Aplicar os mesmos filtros
  if (categoria_id) {
    query = query.where('categoria_id', categoria_id);
  }

  if (searchTerm) {
    query = query.where(function() {
      this.where('nome', 'like', `%${searchTerm}%`)
          .orWhere('descricao', 'like', `%${searchTerm}%`);
    });
  }

  if (preco_min) {
    query = query.where('preco', '>=', preco_min);
  }

  if (preco_max) {
    query = query.where('preco', '<=', preco_max);
  }

  const result = await query.first();
  return result.total;
};

// 🔍 Buscar produto por ID
export const findProductById = async (id) => {
  return await db('produtos')
    .where({ id })
    .first();
};

// ➕ Criar produto (Admin)
export const createProduct = async (productData) => {
  const [id] = await db('produtos').insert({
    ...productData,
    criado_em: new Date()
  });
  return id;
};

// ✏️ Atualizar produto (Admin)
export const updateProduct = async (id, productData) => {
  return await db('produtos')
    .where({ id })
    .update(productData);
};

// 🗑️ Deletar produto (Admin)
export const deleteProduct = async (id) => {
  return await db('produtos')
    .where({ id })
    .del();
};

// 📊 Listar todos os produtos para admin (sem filtro de estoque)
export const getAllProductsAdmin = async (filters = {}) => {
  const { categoria_id, search, page = 1, limit = 10 } = filters;
  const offset = (page - 1) * limit;

  let query = db('produtos')
    .select('*')
    .orderBy('criado_em', 'desc');

  // Filtros opcionais
  if (categoria_id) {
    query = query.where('categoria_id', categoria_id);
  }

  if (search) {
    query = query.where(function() {
      this.where('nome', 'like', `%${search}%`)
          .orWhere('descricao', 'like', `%${search}%`);
    });
  }

  // Paginação
  query = query.limit(limit).offset(offset);

  return await query;
};

// 📊 Contar todos os produtos para admin
export const countAllProductsAdmin = async (filters = {}) => {
  const { categoria_id, search } = filters;

  let query = db('produtos').count('id as total');

  // Aplicar filtros
  if (categoria_id) {
    query = query.where('categoria_id', categoria_id);
  }

  if (search) {
    query = query.where(function() {
      this.where('nome', 'like', `%${search}%`)
          .orWhere('descricao', 'like', `%${search}%`);
    });
  }

  const result = await query.first();
  return result.total;
};

// 🔢 Verificar estoque disponível
export const checkStock = async (id, quantidade) => {
  const produto = await findProductById(id);
  if (!produto) return false;
  return produto.estoque >= quantidade;
};

// 📦 Atualizar estoque
export const updateStock = async (id, novaQuantidade) => {
  return await db('produtos')
    .where({ id })
    .update({
      estoque: novaQuantidade
    });
};

// 📊 Estatísticas de produtos
export const getProductStats = async () => {
  const stats = await db('produtos')
    .select(
      db.raw('COUNT(*) as total_produtos'),
      db.raw('COUNT(CASE WHEN estoque > 0 THEN 1 END) as produtos_em_estoque'),
      db.raw('COUNT(CASE WHEN estoque = 0 THEN 1 END) as produtos_sem_estoque'),
      db.raw('AVG(preco) as preco_medio'),
      db.raw('SUM(estoque) as estoque_total')
    )
    .first();

  return {
    total_produtos: parseInt(stats.total_produtos),
    produtos_em_estoque: parseInt(stats.produtos_em_estoque),
    produtos_sem_estoque: parseInt(stats.produtos_sem_estoque),
    preco_medio: parseFloat(stats.preco_medio || 0).toFixed(2),
    estoque_total: parseInt(stats.estoque_total || 0)
  };
};
