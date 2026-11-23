
// ==========================================
// MODELO DE USUARIOS
// ==========================================

// Importamos la conexión con MySQL.
const conexion = require("../config/database");


// ==========================================
// 1. BUSCAR USUARIO POR EMAIL
// ==========================================

// Buscamos un usuario utilizando su correo electrónico.
const buscarPorEmail = (email, callback) => {

    // Consulta SQL para encontrar al usuario.
    const sql = `
        SELECT
            id_usuario,
            nombre,
            email,
            password_hash
        FROM usuarios
        WHERE email = ?
    `;

    // Ejecutamos la consulta utilizando el correo recibido.
    conexion.query(sql, [email], callback);
};


// ==========================================
// 2. REGISTRAR USUARIO
// ==========================================

// Guardamos un usuario nuevo en la base de datos.
const registrar = (datos, callback) => {

    // Consulta SQL para insertar un usuario.
    const sql = `
        INSERT INTO usuarios (
            nombre,
            email,
            password_hash
        )
        VALUES (?, ?, ?)
    `;

    // Enviamos los datos en el mismo orden que los signos ?.
    conexion.query(
        sql,
        [
            datos.nombre,
            datos.email,
            datos.password_hash
        ],
        callback
    );
};


// ==========================================
// EXPORTAR FUNCIONES
// ==========================================

// Exportamos las funciones para utilizarlas
// desde el controlador.
module.exports = {
    buscarPorEmail,
    registrar
};
