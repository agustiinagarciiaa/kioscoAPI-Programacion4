
const conexion = require("../config/database");

// ==========================================
// LISTAR PRODUCTOS DEL USUARIO
// ==========================================
const listar = (idUsuario, callback) => {
    const sql = `
        SELECT
            p.id_producto,
            p.nombre,
            p.descripcion,
            p.precio,
            p.stock,
            p.stock_minimo,
            p.id_categoria,
            c.nombre AS categoria
        FROM productos p
        INNER JOIN categorias c
            ON p.id_categoria = c.id_categoria
        WHERE p.id_usuario = ?
        AND c.id_usuario = ?
        ORDER BY p.nombre ASC
    `;

    conexion.query(sql, [idUsuario, idUsuario], callback);
};

// ==========================================
// BUSCAR PRODUCTO POR ID
// ==========================================
const buscarPorId = (id, idUsuario, callback) => {
    const sql = `
        SELECT
            p.id_producto,
            p.nombre,
            p.descripcion,
            p.precio,
            p.stock,
            p.stock_minimo,
            p.id_categoria,
            c.nombre AS categoria
        FROM productos p
        INNER JOIN categorias c
            ON p.id_categoria = c.id_categoria
        WHERE p.id_producto = ?
        AND p.id_usuario = ?
        AND c.id_usuario = ?
    `;

    conexion.query(sql, [id, idUsuario, idUsuario], callback);
};

// ==========================================
// REGISTRAR PRODUCTO
// ==========================================
const registrar = (datos, idUsuario, callback) => {
    const sql = `
        INSERT INTO productos (
            nombre,
            descripcion,
            precio,
            stock,
            stock_minimo,
            id_categoria,
            id_usuario
        )
        SELECT
            ?,
            ?,
            ?,
            ?,
            ?,
            c.id_categoria,
            ?
        FROM categorias c
        WHERE c.id_categoria = ?
        AND c.id_usuario = ?
    `;

    conexion.query(
        sql,
        [
            datos.nombre.trim(),
            datos.descripcion ? datos.descripcion.trim() : "",
            Number(datos.precio),
            Number(datos.stock),
            Number(datos.stock_minimo),
            idUsuario,
            Number(datos.id_categoria),
            idUsuario
        ],
        callback
    );
};

// ==========================================
// MODIFICAR PRODUCTO
// ==========================================
const modificar = (id, datos, idUsuario, callback) => {
    const sql = `
        UPDATE productos p
        INNER JOIN categorias c
            ON c.id_categoria = ?
            AND c.id_usuario = ?
        SET
            p.nombre = ?,
            p.descripcion = ?,
            p.precio = ?,
            p.stock = ?,
            p.stock_minimo = ?,
            p.id_categoria = ?
        WHERE p.id_producto = ?
        AND p.id_usuario = ?
    `;

    conexion.query(
        sql,
        [
            Number(datos.id_categoria),
            idUsuario,
            datos.nombre.trim(),
            datos.descripcion ? datos.descripcion.trim() : "",
            Number(datos.precio),
            Number(datos.stock),
            Number(datos.stock_minimo),
            Number(datos.id_categoria),
            id,
            idUsuario
        ],
        callback
    );
};

// ==========================================
// ELIMINAR PRODUCTO
// ==========================================
const eliminar = (id, idUsuario, callback) => {
    const sql = `
        DELETE FROM productos
        WHERE id_producto = ?
        AND id_usuario = ?
    `;

    conexion.query(sql, [id, idUsuario], callback);
};

// ==========================================
// LISTAR PRODUCTOS CON STOCK BAJO
// ==========================================
const listarStockBajo = (idUsuario, callback) => {
    const sql = `
        SELECT
            p.id_producto,
            p.nombre,
            p.stock,
            p.stock_minimo,
            c.nombre AS categoria
        FROM productos p
        INNER JOIN categorias c
            ON p.id_categoria = c.id_categoria
        WHERE p.stock <= p.stock_minimo
        AND p.id_usuario = ?
        AND c.id_usuario = ?
        ORDER BY p.stock ASC
    `;

    conexion.query(sql, [idUsuario, idUsuario], callback);
};

// ==========================================
// EXPORTAR FUNCIONES
// ==========================================
module.exports = {
    listar,
    buscarPorId,
    registrar,
    modificar,
    eliminar,
    listarStockBajo
};
