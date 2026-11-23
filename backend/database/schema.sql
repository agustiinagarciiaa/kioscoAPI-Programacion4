
-- ==================================================
-- SISTEMA DE INVENTARIO PARA UN KIOSCO
-- BASE DE DATOS: inventario_kiosco
-- ==================================================

CREATE DATABASE IF NOT EXISTS inventario_kiosco
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE inventario_kiosco;

-- ==================================================
-- 1. TABLA DE USUARIOS
-- ==================================================

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ==================================================
-- 2. TABLA DE CATEGORIAS
-- ==================================================

CREATE TABLE IF NOT EXISTS categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    id_usuario INT NOT NULL,

    CONSTRAINT uq_categorias_usuario_nombre
        UNIQUE (id_usuario, nombre),

    CONSTRAINT uq_categorias_id_usuario
        UNIQUE (id_categoria, id_usuario),

    CONSTRAINT fk_categorias_usuarios
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==================================================
-- 3. TABLA DE PRODUCTOS
-- ==================================================

CREATE TABLE IF NOT EXISTS productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion VARCHAR(255),
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    stock_minimo INT NOT NULL DEFAULT 5,
    id_categoria INT NOT NULL,
    id_usuario INT NOT NULL,

    CONSTRAINT fk_productos_categorias_usuarios
        FOREIGN KEY (id_categoria, id_usuario)
        REFERENCES categorias(id_categoria, id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT fk_productos_usuarios
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT chk_precio
        CHECK (precio >= 0),

    CONSTRAINT chk_stock
        CHECK (stock >= 0),

    CONSTRAINT chk_stock_minimo
        CHECK (stock_minimo >= 0),

    INDEX idx_productos_usuario (id_usuario)
) ENGINE=InnoDB;

-- ==================================================
-- 4. CONSULTAS PARA VERIFICAR LA BASE DE DATOS
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
