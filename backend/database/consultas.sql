USE inventario_kiosco;

-- ==================================================
-- CONSULTAS PARA VERIFICAR LA BASE DE DATOS
-- (ejecutar después de importar schema.sql y cargar datos)
-- ==================================================

SELECT * FROM usuarios;
SELECT * FROM categorias;
SELECT * FROM productos;

-- Productos junto con sus categorías y usuarios.
SELECT
    p.id_producto,
    p.nombre,
    p.precio,
    p.stock,
    p.stock_minimo,
    c.nombre AS categoria,
    u.nombre AS usuario
FROM productos p
INNER JOIN categorias c
    ON p.id_categoria = c.id_categoria
   AND p.id_usuario = c.id_usuario
INNER JOIN usuarios u
    ON p.id_usuario = u.id_usuario;

-- Productos con stock bajo.
SELECT *
FROM productos
WHERE stock <= stock_minimo;
