
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ==========================================
// CONFIGURACIÓN GENERAL
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// RUTAS
// ==========================================

const authRoutes = require("./routes/authRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");
const productoRoutes = require("./routes/productoRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/productos", productoRoutes);

// ==========================================
// RUTA DE PRUEBA
// ==========================================

app.get("/", (req, res) => {
    res.status(200).json({
        mensaje: "API del Kiosco funcionando correctamente"
    });
});

// ==========================================
// MANEJO DE RUTAS INEXISTENTES
// ==========================================

app.use((req, res) => {
    res.status(404).json({
        mensaje: "La ruta solicitada no existe"
    });
});

// ==========================================
// MANEJO DE ERRORES INESPERADOS
// ==========================================

// Si llega un JSON mal escrito o falla algo que no controlamos,
// respondemos siempre en JSON (y no con una página HTML de error).
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
    if (error.type === "entity.parse.failed") {
        return res.status(400).json({
            mensaje: "El cuerpo de la solicitud no es un JSON válido"
        });
    }

    console.error("Error inesperado:", error);

    res.status(500).json({
        mensaje: "Ocurrió un error inesperado en el servidor"
    });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
