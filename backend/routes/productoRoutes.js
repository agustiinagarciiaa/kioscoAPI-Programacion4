
const express = require("express");
const router = express.Router();

const productoController = require("../controllers/productoController");
const verificarToken = require("../middleware/authMiddleware");

// Todas las rutas requieren un token válido.
router.use(verificarToken);

// PRODUCTOS CON STOCK BAJO
router.get("/stock-bajo", productoController.listarStockBajo);

// LISTAR TODOS LOS PRODUCTOS
router.get("/", productoController.listar);

// BUSCAR UN PRODUCTO
router.get("/:id", productoController.buscarPorId);

// REGISTRAR UN PRODUCTO
router.post("/", productoController.registrar);

// MODIFICAR UN PRODUCTO
router.put("/:id", productoController.modificar);

// ELIMINAR UN PRODUCTO
router.delete("/:id", productoController.eliminar);

module.exports = router;
