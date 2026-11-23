
const conexion = require("../config/database");

// ==========================================
// MODELO DE CATEGORIAS
// Todas las consultas filtran por usuario.
// ==========================================

// LISTAR CATEGORIAS DEL USUARIO
const listar = (idUsuario, callback) => {
    const sql = `
        SELECT id_categoria, nombre, descripcion
        FROM categorias
        WHERE id_usuario = ?
        ORDER BY nombre ASC
    `;

    conexion.query(sql, [idUsuario], callback);
};

// BUSCAR CATEGORIA POR ID Y USUARIO
const buscarPorId = (id, idUsuario, callback) => {
    const sql = `
        SELECT id_categoria, nombre, descripcion
        FROM categorias
        WHERE id_categoria = ?
        AND id_usuario = ?
    `;

    conexion.query(sql, [id, idUsuario], callback);
};

// REGISTRAR CATEGORIA
const registrar = (datos, idUsuario, callback) => {
    const sql = `
        INSERT INTO categorias (nombre, descripcion, id_usuario)
        VALUES (?, ?, ?)
    `;

    conexion.query(
        sql,
        [datos.nombre, datos.descripcion, idUsuario],
        callback
    );
};

// MODIFICAR CATEGORIA
const modificar = (id, datos, idUsuario, callback) => {
    const sql = `
        UPDATE categorias
        SET nombre = ?, descripcion = ?
        WHERE id_categoria = ?
        AND id_usuario = ?
    `;

    conexion.query(
        sql,
        [datos.nombre, datos.descripcion, id, idUsuario],
        callback
    );
};

// ELIMINAR CATEGORIA
const eliminar = (id, idUsuario, callback) => {
    const sql = `
        DELETE FROM categorias
        WHERE id_categoria = ?
        AND id_usuario = ?
    `;

    conexion.query(sql, [id, idUsuario], callback);
};

module.exports = {
    listar,
    buscarPorId,
    registrar,
    modificar,
    eliminar
};
