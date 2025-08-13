import {
  getCategories,
  countCategories,
  findCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  categoryExists,
  categoryNameExists,
  getCategoryStats
} from './categoryModel.js';

import {
  createCategorySchema,
  updateCategorySchema,
  searchCategorySchema
} from './categorySchema.js';

// 📋 GET /categories - Listar categorias (público)
export const listCategories = async (req, res) => {
  try {
    console.log('📋 Listando categorias públicas');
    
    // Validar query parameters
    const { error, value } = searchCategorySchema.validate(req.query);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const filters = value;
    const [categorias, total] = await Promise.all([
      getCategories(filters),
      countCategories(filters)
    ]);

    const totalPages = Math.ceil(total / filters.limit);

    console.log(`✅ ${categorias.length} categorias encontradas`);
    
    res.json({
      categorias,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages,
        hasNext: filters.page < totalPages,
        hasPrev: filters.page > 1
      }
    });
  } catch (error) {
    console.error('❌ Erro ao listar categorias:', error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// 🔍 GET /categories/:id - Detalhes da categoria (público)
export const getCategoryDetails = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Buscando detalhes da categoria ID: ${id}`);

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID da categoria inválido." });
    }

    const categoria = await findCategoryById(id);
    if (!categoria) {
      return res.status(404).json({ error: "Categoria não encontrada." });
    }

    console.log(`✅ Categoria encontrada: ${categoria.nome}`);
    res.json({ categoria });
  } catch (error) {
    console.error('❌ Erro ao buscar categoria:', error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// ➕ POST /admin/categories - Criar categoria (Admin)
export const createCategoryAdmin = async (req, res) => {
  try {
    console.log('➕ Criando nova categoria (Admin)');
    
    const { error } = createCategorySchema.validate(req.body);
    if (error) {
      console.log('❌ Erro de validação:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    const { nome } = req.body;

    // Verificar se o nome já existe
    const nomeExiste = await categoryNameExists(nome);
    if (nomeExiste) {
      console.log('❌ Nome da categoria já existe:', nome);
      return res.status(400).json({ error: "Já existe uma categoria com este nome." });
    }

    const categoryId = await createCategory({ nome });
    const categoria = await findCategoryById(categoryId);

    console.log(`✅ Categoria criada com sucesso: ${categoria.nome} (ID: ${categoryId})`);
    res.status(201).json({ 
      message: "Categoria criada com sucesso!", 
      categoria 
    });
  } catch (error) {
    console.error('❌ Erro ao criar categoria:', error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// ✏️ PATCH /admin/categories/:id - Atualizar categoria (Admin)
export const updateCategoryAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`✏️ Atualizando categoria ID: ${id} (Admin)`);

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID da categoria inválido." });
    }

    const { error } = updateCategorySchema.validate(req.body);
    if (error) {
      console.log('❌ Erro de validação:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    // Verificar se a categoria existe
    const categoriaExiste = await categoryExists(id);
    if (!categoriaExiste) {
      return res.status(404).json({ error: "Categoria não encontrada." });
    }

    const { nome } = req.body;

    // Se o nome está sendo alterado, verificar se já existe
    if (nome) {
      const nomeExiste = await categoryNameExists(nome, id);
      if (nomeExiste) {
        console.log('❌ Nome da categoria já existe:', nome);
        return res.status(400).json({ error: "Já existe uma categoria com este nome." });
      }
    }

    const sucesso = await updateCategory(id, req.body);
    if (!sucesso) {
      return res.status(400).json({ error: "Nenhuma alteração foi feita." });
    }

    const categoria = await findCategoryById(id);

    console.log(`✅ Categoria atualizada com sucesso: ${categoria.nome}`);
    res.json({ 
      message: "Categoria atualizada com sucesso!", 
      categoria 
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar categoria:', error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// 🗑️ DELETE /admin/categories/:id - Deletar categoria (Admin)
export const deleteCategoryAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Deletando categoria ID: ${id} (Admin)`);

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID da categoria inválido." });
    }

    // Verificar se a categoria existe
    const categoria = await findCategoryById(id);
    if (!categoria) {
      return res.status(404).json({ error: "Categoria não encontrada." });
    }

    await deleteCategory(id);

    console.log(`✅ Categoria deletada com sucesso: ${categoria.nome}`);
    res.json({ 
      message: "Categoria deletada com sucesso!",
      categoria: categoria.nome
    });
  } catch (error) {
    console.error('❌ Erro ao deletar categoria:', error);
    
    // Se for erro de produtos vinculados, retornar erro específico
    if (error.message.includes('produto(s) vinculado(s)')) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// 📊 GET /admin/categories/stats - Estatísticas de categorias (Admin)
export const getCategoryStatsAdmin = async (req, res) => {
  try {
    console.log('📊 Gerando estatísticas de categorias (Admin)');

    const stats = await getCategoryStats();

    console.log('✅ Estatísticas geradas com sucesso');
    res.json({
      message: "Estatísticas de categorias",
      stats
    });
  } catch (error) {
    console.error('❌ Erro ao gerar estatísticas:', error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};