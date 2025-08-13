import db from "../../db.js";

// 📋 Listar todas as categorias (público)
export const getCategories = async (filters = {}) => {
  const { q, page = 1, limit = 10 } = filters;
  const offset = (page - 1) * limit;

  let query = db('categorias')
    .select('*')
    .orderBy('nome', 'asc');

  // Buscar por nome se fornecido
  if (q) {
    query = query.where('nome', 'like', `%${q}%`);
  }

  // Aplicar paginação
  query = query.limit(limit).offset(offset);

  return await query;
};

// 📊 Contar total de categorias (para paginação)
export const countCategories = async (filters = {}) => {
  const { q } = filters;

  let query = db('categorias').count('id as total');

  // Aplicar mesmo filtro de busca
  if (q) {
    query = query.where('nome', 'like', `%${q}%`);
  }

  const result = await query.first();
  return result.total;
};

// 🔍 Buscar categoria por ID
export const findCategoryById = async (id) => {
  const categoria = await db('categorias')
    .select('*')
    .where('id', id)
    .first();
  
  return categoria;
};

// ➕ Criar nova categoria (Admin)
export const createCategory = async (categoryData) => {
  const [id] = await db('categorias').insert(categoryData);
  return id;
};

// ✏️ Atualizar categoria (Admin)
export const updateCategory = async (id, categoryData) => {
  const updated = await db('categorias')
    .where('id', id)
    .update(categoryData);
  
  return updated > 0;
};

// 🗑️ Deletar categoria (Admin)
export const deleteCategory = async (id) => {
  // Verificar se existem produtos nesta categoria
  const productsCount = await db('produtos')
    .count('id as total')
    .where('categoria_id', id)
    .first();

  if (productsCount.total > 0) {
    throw new Error(`Não é possível excluir a categoria. Existem ${productsCount.total} produto(s) vinculado(s) a esta categoria.`);
  }

  const deleted = await db('categorias')
    .where('id', id)
    .del();
  
  return deleted > 0;
};

// 📊 Verificar se categoria existe
export const categoryExists = async (id) => {
  const count = await db('categorias')
    .count('id as total')
    .where('id', id)
    .first();
  
  return count.total > 0;
};

// 📊 Verificar se nome da categoria já existe (para evitar duplicatas)
export const categoryNameExists = async (nome, excludeId = null) => {
  let query = db('categorias')
    .count('id as total')
    .where('nome', nome);
  
  // Excluir ID específico (útil para updates)
  if (excludeId) {
    query = query.where('id', '!=', excludeId);
  }
  
  const result = await query.first();
  return result.total > 0;
};

// 📊 Estatísticas de categorias (Admin)
export const getCategoryStats = async () => {
  const stats = await db('categorias as c')
    .select('c.id', 'c.nome')
    .count('p.id as total_produtos')
    .leftJoin('produtos as p', 'c.id', 'p.categoria_id')
    .groupBy('c.id', 'c.nome')
    .orderBy('total_produtos', 'desc');

  const totalCategorias = await db('categorias').count('id as total').first();
  const categoriasComProdutos = stats.filter(cat => cat.total_produtos > 0).length;
  const categoriasSemProdutos = totalCategorias.total - categoriasComProdutos;

  return {
    total_categorias: totalCategorias.total,
    categorias_com_produtos: categoriasComProdutos,
    categorias_sem_produtos: categoriasSemProdutos,
    detalhes_por_categoria: stats
  };
};