
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
// INICIAR SERVIDOR
// ==========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
