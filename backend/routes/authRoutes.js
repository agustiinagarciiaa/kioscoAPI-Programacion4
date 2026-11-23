
// ==========================================
// RUTAS DE AUTENTICACION
// ==========================================

// Importamos Express.
const express = require("express");

// Creamos el administrador de rutas.
const router = express.Router();

// Importamos el controlador de autenticación.
const authController = require("../controllers/authController");


// ==========================================
// REGISTRO E INICIO DE SESION
// ==========================================

// Ruta para registrar un usuario nuevo.
router.post("/registro", authController.registrar);

// Ruta para iniciar sesión.
router.post("/login", authController.login);


// ==========================================
// EXPORTAR RUTAS
// ==========================================

// Exportamos las rutas para utilizarlas en server.js.
module.exports = router;
