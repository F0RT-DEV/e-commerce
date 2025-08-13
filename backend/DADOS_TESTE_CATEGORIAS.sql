-- 🏷️ DADOS DE TESTE PARA CATEGORIAS
-- Execute no MySQL Workbench/phpMyAdmin

USE ecommerce_db;

-- 🗂️ Inserir categorias de teste (caso não existam)
INSERT IGNORE INTO categorias (id, nome) VALUES
(1, 'Smartphones'),
(2, 'Notebooks'),
(3, 'Áudio'),
(4, 'Games'),
(5, 'Periféricos'),
(6, 'Tablets'),
(7, 'Smartwatches'),
(8, 'Câmeras'),
(9, 'Casa Inteligente'),
(10, 'Acessórios');

-- Verificar categorias inseridas
SELECT * FROM categorias ORDER BY nome;

-- 📊 Estatísticas de categorias
SELECT 
  c.id,
  c.nome,
  COUNT(p.id) as total_produtos
FROM categorias c
LEFT JOIN produtos p ON c.id = p.categoria_id
GROUP BY c.id, c.nome
ORDER BY total_produtos DESC, c.nome;

-- 📈 Resumo geral
SELECT 
  COUNT(*) as total_categorias,
  COUNT(CASE WHEN p.categoria_id IS NOT NULL THEN 1 END) as categorias_com_produtos,
  COUNT(CASE WHEN p.categoria_id IS NULL THEN 1 END) as categorias_sem_produtos
FROM categorias c
LEFT JOIN produtos p ON c.id = p.categoria_id;
