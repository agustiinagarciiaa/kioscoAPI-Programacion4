
const categoriaModel = require("../models/categoriaModel");

// ==========================================
// CONTROLADOR DE CATEGORIAS
// ==========================================

// LISTAR
const listar = (req, res) => {
    const idUsuario = req.usuario.id_usuario;

    categoriaModel.listar(idUsuario, (error, resultados) => {
        if (error) {
            return res.status(500).json({
                mensaje: "Error al obtener las categorías"
            });
        }

        res.status(200).json(resultados);
    });
};

// BUSCAR POR ID
const buscarPorId = (req, res) => {
    const id = Number(req.params.id);
    const idUsuario = req.usuario.id_usuario;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            mensaje: "El ID de la categoría no es válido"
        });
    }

    categoriaModel.buscarPorId(id, idUsuario, (error, resultados) => {
        if (error) {
            return res.status(500).json({
                mensaje: "Error al buscar la categoría"
            });
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });
        }

        res.status(200).json(resultados[0]);
    });
};

// REGISTRAR
const registrar = (req, res) => {
    const idUsuario = req.usuario.id_usuario;
    const { nombre, descripcion } = req.body;

    if (typeof nombre !== "string" || !nombre.trim()) {
        return res.status(400).json({
            mensaje: "El nombre de la categoría es obligatorio"
        });
    }

    if (nombre.trim().length > 100) {
        return res.status(400).json({
            mensaje: "El nombre no puede superar los 100 caracteres"
        });
    }

    if (
        descripcion !== undefined &&
        descripcion !== null &&
        typeof descripcion !== "string"
    ) {
        return res.status(400).json({
            mensaje: "La descripción debe ser un texto"
        });
    }

    if (descripcion && descripcion.length > 255) {
        return res.status(400).json({
            mensaje: "La descripción no puede superar los 255 caracteres"
        });
    }

    const datos = {
        nombre: nombre.trim(),
        descripcion: descripcion ? descripcion.trim() : null
    };

    categoriaModel.registrar(datos, idUsuario, (error, resultado) => {
        if (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    mensaje: "Ya existe una categoría con ese nombre"
                });
            }

            return res.status(500).json({
                mensaje: "Error al registrar la categoría"
            });
        }

        res.status(201).json({
            mensaje: "Categoría registrada correctamente",
            id_categoria: resultado.insertId
        });
    });
};

// MODIFICAR
const modificar = (req, res) => {
    const id = Number(req.params.id);
    const idUsuario = req.usuario.id_usuario;
    const { nombre, descripcion } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            mensaje: "El ID de la categoría no es válido"
        });
    }

    if (typeof nombre !== "string" || !nombre.trim()) {
        return res.status(400).json({
            mensaje: "El nombre de la categoría es obligatorio"
        });
    }

    if (nombre.trim().length > 100) {
        return res.status(400).json({
            mensaje: "El nombre no puede superar los 100 caracteres"
        });
    }

    if (
        descripcion !== undefined &&
        descripcion !== null &&
        typeof descripcion !== "string"
    ) {
        return res.status(400).json({
            mensaje: "La descripción debe ser un texto"
        });
    }

    if (descripcion && descripcion.length > 255) {
        return res.status(400).json({
            mensaje: "La descripción no puede superar los 255 caracteres"
        });
    }

    const datos = {
        nombre: nombre.trim(),
        descripcion: descripcion ? descripcion.trim() : null
    };

    categoriaModel.modificar(id, datos, idUsuario, (error, resultado) => {
        if (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    mensaje: "Ya existe una categoría con ese nombre"
                });
            }

            return res.status(500).json({
                mensaje: "Error al modificar la categoría"
            });
        }

        if (resultado.affectedRows === 0) {
            return categoriaModel.buscarPorId(
                id,
                idUsuario,
                (errorBusqueda, resultados) => {
                    if (errorBusqueda) {
                        return res.status(500).json({
                            mensaje: "Error al verificar la categoría"
                        });
                    }

                    if (resultados.length === 0) {
                        return res.status(404).json({
                            mensaje: "Categoría no encontrada"
                        });
                    }

                    res.status(200).json({
                        mensaje: "La categoría no tenía cambios"
                    });
                }
            );
        }

        res.status(200).json({
            mensaje: "Categoría modificada correctamente"
        });
    });
};

// ELIMINAR
const eliminar = (req, res) => {
    const id = Number(req.params.id);
    const idUsuario = req.usuario.id_usuario;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            mensaje: "El ID de la categoría no es válido"
        });
    }

    categoriaModel.eliminar(id, idUsuario, (error, resultado) => {
        if (error) {
            if (error.code === "ER_ROW_IS_REFERENCED_2") {
                return res.status(409).json({
                    mensaje: "No se puede eliminar una categoría que tiene productos asociados"
                });
            }

            return res.status(500).json({
                mensaje: "Error al eliminar la categoría"
            });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });
        }

        res.status(200).json({
            mensaje: "Categoría eliminada correctamente"
        });
    });
};

module.exports = {
    listar,
    buscarPorId,
    registrar,
    modificar,
    eliminar
};
