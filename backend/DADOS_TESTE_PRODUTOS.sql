-- 📦 DADOS DE TESTE PARA PRODUTOS
-- Execute no MySQL Workbench/phpMyAdmin

USE ecommerce_db;

-- 🏷️ Primeiro, criar categorias de teste
CREATE TABLE IF NOT EXISTS categorias (
  id INT(11) NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- Inserir categorias básicas
INSERT IGNORE INTO categorias (id, nome, descricao) VALUES
(1, 'Smartphones', 'Telefones celulares e acessórios'),
(2, 'Notebooks', 'Laptops e computadores portáteis'),
(3, 'Áudio', 'Fones de ouvido e equipamentos de som'),
(4, 'Games', 'Consoles e jogos eletrônicos'),
(5, 'Periféricos', 'Monitores, teclados e acessórios para PC');

-- 🛍️ Produtos de teste
INSERT INTO produtos (nome, descricao, preco, estoque, categoria_id, imagem, criado_em) VALUES
('iPhone 15 Pro', 'Smartphone Apple com 128GB, câmera tripla e tela Super Retina XDR', 8999.99, 15, 1, 'https://example.com/iphone15.jpg', NOW()),
('Samsung Galaxy S24', 'Smartphone Samsung com 256GB, câmera de 200MP e tela Dynamic AMOLED', 6999.99, 8, 1, 'https://example.com/galaxys24.jpg', NOW()),
('MacBook Air M3', 'Notebook Apple com chip M3, 16GB RAM e 512GB SSD', 12999.99, 5, 2, 'https://example.com/macbook.jpg', NOW()),
('Dell XPS 13', 'Ultrabook Dell com Intel i7, 16GB RAM e 1TB SSD', 8999.99, 3, 2, 'https://example.com/dellxps.jpg', NOW()),
('Sony WH-1000XM5', 'Fone de ouvido com cancelamento de ruído ativo', 1899.99, 20, 3, 'https://example.com/sony-headphone.jpg', NOW()),
('AirPods Pro 2', 'Fones de ouvido Apple com cancelamento ativo de ruído', 2299.99, 12, 3, 'https://example.com/airpods.jpg', NOW()),
('PlayStation 5', 'Console de videogame Sony com 825GB SSD', 4999.99, 0, 4, 'https://example.com/ps5.jpg', NOW()),
('Xbox Series X', 'Console Microsoft com 1TB SSD e 4K gaming', 4799.99, 7, 4, 'https://example.com/xbox.jpg', NOW()),
('Monitor LG 27"', 'Monitor 4K UltraHD com 144Hz e HDR', 2199.99, 10, 5, 'https://example.com/monitor.jpg', NOW()),
('Teclado Mecânico', 'Teclado gamer RGB com switches Cherry MX', 899.99, 25, 5, 'https://example.com/teclado.jpg', NOW());

-- Verificar dados inseridos
SELECT * FROM produtos ORDER BY criado_em DESC;

-- 📊 Estatísticas
SELECT 
  COUNT(*) as total_produtos,
  COUNT(CASE WHEN estoque > 0 THEN 1 END) as produtos_em_estoque,
  COUNT(CASE WHEN estoque = 0 THEN 1 END) as produtos_sem_estoque,
  AVG(preco) as preco_medio,
  SUM(estoque) as estoque_total
FROM produtos;
