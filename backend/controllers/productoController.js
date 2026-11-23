
const productoModel = require("../models/productoModel");

// ==========================================
// VALIDAR DATOS DEL PRODUCTO
// ==========================================
const validarProducto = (datos) => {
    const { nombre, precio, stock, stock_minimo, id_categoria } = datos;

    if (typeof nombre !== "string" || !nombre.trim()) {
        return "El nombre del producto es obligatorio";
    }

    if (precio === undefined || precio === "" || !Number.isFinite(Number(precio)) || Number(precio) < 0) {
        return "El precio debe ser mayor o igual a cero";
    }

    if (stock === undefined || stock === "" || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
        return "El stock debe ser un entero mayor o igual a cero";
    }

    if (stock_minimo === undefined || stock_minimo === "" || !Number.isInteger(Number(stock_minimo)) || Number(stock_minimo) < 0) {
        return "El stock mínimo debe ser un entero mayor o igual a cero";
    }

    if (!Number.isInteger(Number(id_categoria)) || Number(id_categoria) <= 0) {
        return "Debés seleccionar una categoría válida";
    }

    return null;
};

// ==========================================
// LISTAR PRODUCTOS
// ==========================================
const listar = (req, res) => {
    const idUsuario = req.usuario.id_usuario;

    productoModel.listar(idUsuario, (error, resultados) => {
        if (error) {
            return res.status(500).json({ mensaje: "Error al obtener los productos" });
        }

        res.status(200).json(resultados);
    });
};

// ==========================================
// BUSCAR PRODUCTO
// ==========================================
const buscarPorId = (req, res) => {
    const id = Number(req.params.id);
    const idUsuario = req.usuario.id_usuario;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ mensaje: "ID no válido" });
    }

    productoModel.buscarPorId(id, idUsuario, (error, resultado) => {
        if (error) {
            return res.status(500).json({ mensaje: "Error al buscar el producto" });
        }

        if (resultado.length === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        res.status(200).json(resultado[0]);
    });
};

// ==========================================
// REGISTRAR PRODUCTO
// ==========================================
const registrar = (req, res) => {
    const idUsuario = req.usuario.id_usuario;
    const datos = req.body;

    const errorValidacion = validarProducto(datos);

    if (errorValidacion) {
        return res.status(400).json({ mensaje: errorValidacion });
    }

    productoModel.registrar(datos, idUsuario, (error, resultado) => {
        if (error) {
            console.error("Error al registrar producto:", error);
            return res.status(500).json({ mensaje: "Error al registrar el producto" });
        }

        if (resultado.affectedRows === 0) {
            return res.status(400).json({
                mensaje: "La categoría seleccionada no existe o no te pertenece"
            });
        }

        res.status(201).json({
            mensaje: "Producto registrado correctamente",
            id_producto: resultado.insertId
        });
    });
};

// ==========================================
// MODIFICAR PRODUCTO
// ==========================================
const modificar = (req, res) => {
    const id = Number(req.params.id);
    const idUsuario = req.usuario.id_usuario;
    const datos = req.body;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ mensaje: "ID no válido" });
    }

    const errorValidacion = validarProducto(datos);

    if (errorValidacion) {
        return res.status(400).json({ mensaje: errorValidacion });
    }

    productoModel.buscarPorId(id, idUsuario, (error, producto) => {
        if (error) {
            return res.status(500).json({ mensaje: "Error al buscar el producto" });
        }

        if (producto.length === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        productoModel.modificar(id, datos, idUsuario, (error, resultado) => {
            if (error) {
                return res.status(500).json({ mensaje: "Error al modificar el producto" });
            }

            if (resultado.affectedRows === 0) {
                return res.status(400).json({
                    mensaje: "No se pudo modificar el producto"
                });
            }

            res.status(200).json({ mensaje: "Producto modificado correctamente" });
        });
    });
};

// ==========================================
// ELIMINAR PRODUCTO
// ==========================================
const eliminar = (req, res) => {
    const id = Number(req.params.id);
    const idUsuario = req.usuario.id_usuario;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ mensaje: "ID no válido" });
    }

    productoModel.eliminar(id, idUsuario, (error, resultado) => {
        if (error) {
            return res.status(500).json({ mensaje: "Error al eliminar el producto" });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        res.status(200).json({ mensaje: "Producto eliminado correctamente" });
    });
};

// ==========================================
// PRODUCTOS CON STOCK BAJO
// ==========================================
const listarStockBajo = (req, res) => {
    const idUsuario = req.usuario.id_usuario;

    productoModel.listarStockBajo(idUsuario, (error, resultados) => {
        if (error) {
            return res.status(500).json({
                mensaje: "Error al obtener los productos con stock bajo"
            });
        }

        res.status(200).json(resultados);
    });
};

module.exports = {
    listar,
    buscarPorId,
    registrar,
    modificar,
    eliminar,
    listarStockBajo
};
