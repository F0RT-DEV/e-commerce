import {
  getProducts,
  countProducts,
  findProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin,
  countAllProductsAdmin,
  checkStock,
  updateStock,
  getProductStats
} from './productModel.js';

import {
  createProductSchema,
  updateProductSchema,
  searchProductSchema
} from './productSchema.js';

// 📋 GET /products - Listar produtos (público)
export const listProducts = async (req, res) => {
  try {
    console.log('📋 Listando produtos públicos');
    
    // Validar query parameters
    const { error, value } = searchProductSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const filters = value;
    const [produtos, total] = await Promise.all([
      getProducts(filters),
      countProducts(filters)
    ]);

    const totalPages = Math.ceil(total / filters.limit);

    console.log(`✅ ${produtos.length} produtos encontrados`);
    
    res.json({
      produtos,
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
    console.error('❌ Erro ao listar produtos:', error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// 🔍 GET /products/search - Buscar produtos (público)
export const searchProducts = async (req, res) => {
  try {
    console.log('🔍 Buscando produtos com filtros');
    
    // Validar query parameters
    const { error, value } = searchProductSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const filters = value;
    const [produtos, total] = await Promise.all([
      getProducts(filters),
      countProducts(filters)
    ]);

    const totalPages = Math.ceil(total / filters.limit);

    console.log(`✅ ${produtos.length} produtos encontrados com busca: "${filters.q || 'sem termo'}"`);
    
    res.json({
      produtos,
      busca: {
        termo: filters.q || null,
        categoria_id: filters.categoria_id || null,
        preco_min: filters.preco_min || null,
        preco_max: filters.preco_max || null,
        total_encontrados: total
      },
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
    console.error('❌ Erro ao buscar produtos:', error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// 🔍 GET /products/:id - Detalhes do produto (público)
export const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Buscando detalhes do produto ID: ${id}`);

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID do produto inválido." });
    }

    const produto = await findProductById(id);
    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    // Só mostrar produtos em estoque para usuários públicos
    if (produto.estoque <= 0) {
      return res.status(404).json({ error: "Produto indisponível." });
    }

    console.log(`✅ Produto encontrado: ${produto.nome}`);
    res.json({ produto });
  } catch (error) {
    console.error('❌ Erro ao buscar produto:', error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// ➕ POST /admin/products - Criar produto (Admin)
export const createProductAdmin = async (req, res) => {
  try {
    console.log('➕ Criando novo produto (Admin)');
    
    const { error } = createProductSchema.validate(req.body);
    if (error) {
      console.log('❌ Erro de validação:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    const productId = await createProduct(req.body);
    const produto = await findProductById(productId);

    console.log(`✅ Produto criado: ${produto.nome} (ID: ${productId})`);
    res.status(201).json({
      message: "Produto criado com sucesso!",
      produto
    });
  } catch (error) {
    console.error('❌ Erro ao criar produto:', error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// ✏️ PATCH /admin/products/:id - Atualizar produto (Admin)
export const updateProductAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`✏️ Atualizando produto ID: ${id} (Admin)`);

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID do produto inválido." });
    }

    const { error } = updateProductSchema.validate(req.body);
    if (error) {
      console.log('❌ Erro de validação:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    // Verificar se produto existe
    const produto = await findProductById(id);
    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    await updateProduct(id, req.body);
    const produtoAtualizado = await findProductById(id);

    console.log(`✅ Produto atualizado: ${produtoAtualizado.nome}`);
    res.json({
      message: "Produto atualizado com sucesso!",
      produto: produtoAtualizado
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar produto:', error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// 🗑️ DELETE /admin/products/:id - Deletar produto (Admin)
export const deleteProductAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Deletando produto ID: ${id} (Admin)`);

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID do produto inválido." });
    }

    // Verificar se produto existe
    const produto = await findProductById(id);
    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    await deleteProduct(id);

    console.log(`✅ Produto deletado: ${produto.nome}`);
    res.json({ message: "Produto deletado com sucesso!" });
  } catch (error) {
    console.error('❌ Erro ao deletar produto:', error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// 📊 GET /admin/products - Listar todos os produtos (Admin)
export const listAllProductsAdmin = async (req, res) => {
  try {
    console.log('📊 Listando todos os produtos (Admin)');
    
    // Validar query parameters
    const { error, value } = searchProductSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const filters = value;
    const [produtos, total] = await Promise.all([
      getAllProductsAdmin(filters),
      countAllProductsAdmin(filters)
    ]);

    const totalPages = Math.ceil(total / filters.limit);

    console.log(`✅ ${produtos.length} produtos encontrados (Admin)`);
    
    res.json({
      produtos,
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
    console.error('❌ Erro ao listar produtos (Admin):', error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// 🔍 GET /admin/products/:id - Detalhes do produto (Admin)
export const getProductDetailsAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 Buscando detalhes do produto ID: ${id} (Admin)`);

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID do produto inválido." });
    }

    const produto = await findProductById(id);
    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    console.log(`✅ Produto encontrado: ${produto.nome} (Admin)`);
    res.json({ produto });
  } catch (error) {
    console.error('❌ Erro ao buscar produto (Admin):', error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// 📦 PATCH /admin/products/:id/stock - Atualizar estoque (Admin)
export const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { estoque } = req.body;
    
    console.log(`📦 Atualizando estoque do produto ID: ${id}`);

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID do produto inválido." });
    }

    if (estoque === undefined || isNaN(estoque) || estoque < 0) {
      return res.status(400).json({ error: "Estoque deve ser um número não negativo." });
    }

    // Verificar se produto existe
    const produto = await findProductById(id);
    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    await updateStock(id, estoque);

    console.log(`✅ Estoque atualizado: ${produto.nome} -> ${estoque} unidades`);
    res.json({ 
      message: "Estoque atualizado com sucesso!",
      produto: { 
        ...produto, 
        estoque: estoque 
      }
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar estoque:', error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// 📊 GET /admin/products/stats - Estatísticas de produtos (Admin)
export const getProductStatistics = async (req, res) => {
  try {
    console.log('📊 Obtendo estatísticas de produtos (Admin)');

    const stats = await getProductStats();

    console.log('✅ Estatísticas obtidas:', stats);
    res.json({ stats });
  } catch (error) {
    console.error('❌ Erro ao obter estatísticas:', error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};
