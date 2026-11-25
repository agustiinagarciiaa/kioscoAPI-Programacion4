-- ==================================================
-- DATOS DE EJEMPLO PARA TUKIOSCO
-- Carga categorías y productos para un usuario.
-- Se puede correr varias veces: no duplica datos.
-- ==================================================

USE inventario_kiosco;

-- Usuario al que se le cargan los datos.
-- Por defecto, el primer usuario registrado. Para elegir otro:
-- SET @id_usuario = (SELECT id_usuario FROM usuarios WHERE email = 'tu@correo.com');
SET @id_usuario = (SELECT MIN(id_usuario) FROM usuarios);

-- ==================================================
-- CATEGORÍAS
-- ==================================================

INSERT IGNORE INTO categorias (nombre, descripcion, id_usuario) VALUES
    ('Golosinas', 'Caramelos, chupetines y chicles', @id_usuario),
    ('Chocolates', 'Chocolates, alfajores y bombones', @id_usuario),
    ('Bebidas', 'Gaseosas, aguas y jugos', @id_usuario),
    ('Snacks', 'Papas fritas, maní y palitos', @id_usuario),
    ('Galletitas', 'Galletitas dulces y saladas', @id_usuario),
    ('Cigarrillos', 'Cigarrillos y encendedores', @id_usuario),
    ('Almacén', 'Productos básicos de almacén', @id_usuario);

-- ==================================================
-- PRODUCTOS
-- Algunos quedan con stock bajo para probar esa sección.
-- ==================================================

INSERT INTO productos (nombre, descripcion, precio, stock, stock_minimo, id_categoria, id_usuario)
SELECT p.nombre, p.descripcion, p.precio, p.stock, p.stock_minimo, c.id_categoria, @id_usuario
FROM (
    SELECT 'Alfajor triple de chocolate' AS nombre, 'Alfajor relleno de dulce de leche' AS descripcion, 1200.00 AS precio, 40 AS stock, 10 AS stock_minimo, 'Chocolates' AS categoria
    UNION ALL SELECT 'Alfajor de maicena', 'Con coco rallado', 900.00, 4, 8, 'Chocolates'
    UNION ALL SELECT 'Chocolate con leche 100 g', 'Tableta clásica', 2500.00, 18, 5, 'Chocolates'
    UNION ALL SELECT 'Bombón de chocolate', 'Unidad suelta', 350.00, 60, 15, 'Chocolates'
    UNION ALL SELECT 'Chupetín de frutilla', 'Unidad', 150.00, 120, 30, 'Golosinas'
    UNION ALL SELECT 'Caramelos masticables', 'Paquete de 10 unidades', 600.00, 3, 10, 'Golosinas'
    UNION ALL SELECT 'Chicle de menta', 'Paquete de 5 unidades', 500.00, 45, 10, 'Golosinas'
    UNION ALL SELECT 'Pastillas de menta', 'Rollo', 700.00, 25, 8, 'Golosinas'
    UNION ALL SELECT 'Gaseosa cola 500 ml', 'Botella', 1500.00, 24, 12, 'Bebidas'
    UNION ALL SELECT 'Gaseosa lima limón 500 ml', 'Botella', 1400.00, 6, 12, 'Bebidas'
    UNION ALL SELECT 'Agua mineral 500 ml', 'Sin gas', 900.00, 30, 12, 'Bebidas'
    UNION ALL SELECT 'Jugo de naranja 1 L', 'En caja', 1300.00, 15, 6, 'Bebidas'
    UNION ALL SELECT 'Bebida energizante 473 ml', 'Lata', 2200.00, 10, 4, 'Bebidas'
    UNION ALL SELECT 'Papas fritas clásicas 80 g', 'Bolsa', 1800.00, 20, 8, 'Snacks'
    UNION ALL SELECT 'Maní salado 100 g', 'Bolsa', 1100.00, 2, 6, 'Snacks'
    UNION ALL SELECT 'Palitos salados 100 g', 'Bolsa', 1000.00, 14, 6, 'Snacks'
    UNION ALL SELECT 'Galletitas de chocolate', 'Paquete 150 g', 1300.00, 22, 8, 'Galletitas'
    UNION ALL SELECT 'Galletitas de agua', 'Paquete 200 g', 1000.00, 16, 6, 'Galletitas'
    UNION ALL SELECT 'Galletitas rellenas de vainilla', 'Paquete 120 g', 1200.00, 5, 8, 'Galletitas'
    UNION ALL SELECT 'Cigarrillos box 20', 'Atado', 3500.00, 30, 10, 'Cigarrillos'
    UNION ALL SELECT 'Encendedor', 'Unidad', 800.00, 12, 5, 'Cigarrillos'
    UNION ALL SELECT 'Yerba mate 500 g', 'Paquete', 3200.00, 8, 4, 'Almacén'
    UNION ALL SELECT 'Azúcar 1 kg', 'Paquete', 1500.00, 1, 4, 'Almacén'
    UNION ALL SELECT 'Pilas AA x2', 'Blíster', 2000.00, 10, 4, 'Almacén'
) AS p
JOIN categorias c
    ON c.nombre = p.categoria
    AND c.id_usuario = @id_usuario
WHERE NOT EXISTS (
    SELECT 1
    FROM productos pr
    WHERE pr.nombre = p.nombre
        AND pr.id_usuario = @id_usuario
);
