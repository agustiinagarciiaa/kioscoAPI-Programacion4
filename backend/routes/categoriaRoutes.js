
const express = require("express");
const router = express.Router();

const categoriaController = require("../controllers/categoriaController");
const verificarToken = require("../middleware/authMiddleware");

// Todas las rutas requieren autenticación.
router.use(verificarToken);

router.get("/", categoriaController.listar);
router.get("/:id", categoriaController.buscarPorId);
router.post("/", categoriaController.registrar);
router.put("/:id", categoriaController.modificar);
router.delete("/:id", categoriaController.eliminar);

module.exports = router;
