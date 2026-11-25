
const mysql = require("mysql2");

// ==========================================
// CONEXIÓN A MYSQL (POOL)
// ==========================================

// Usamos un "pool": un grupo de conexiones que se reutilizan.
// Si una conexión se cae, el pool abre otra y la API sigue funcionando.
// Los modelos lo usan igual que antes: conexion.query(sql, valores, callback).
const conexion = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10
});

// Probamos la conexión al iniciar para avisar por consola si algo falla.
conexion.getConnection((error, conexionPrueba) => {
    if (error) {
        console.error("Error al conectar con MySQL:", error.message);
        return;
    }

    console.log("Conexión a MySQL establecida correctamente");
    conexionPrueba.release();
});

module.exports = conexion;
