-- ==================================================
-- MIGRACIÓN: solo para bases creadas con la versión anterior
-- del schema (la que tenía ON DELETE CASCADE).
-- Cambia la regla sin borrar los datos que ya cargaron.
-- Si creás la base desde cero con schema.sql, NO hace falta.
-- ==================================================

USE inventario_kiosco;

ALTER TABLE productos
    DROP FOREIGN KEY fk_productos_categorias_usuarios;

ALTER TABLE productos
    ADD CONSTRAINT fk_productos_categorias_usuarios
        FOREIGN KEY (id_categoria, id_usuario)
        REFERENCES categorias(id_categoria, id_usuario)
        ON DELETE RESTRICT;
