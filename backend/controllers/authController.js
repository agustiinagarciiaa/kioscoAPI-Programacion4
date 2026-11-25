
// ==========================================
// CONTROLADOR DE AUTENTICACION
// ==========================================

// Importamos el modelo de usuarios.
const usuarioModel = require("../models/usuarioModel");

// Importamos bcryptjs para proteger las contraseñas.
const bcrypt = require("bcryptjs");

// Importamos jsonwebtoken para generar tokens.
const jwt = require("jsonwebtoken");


// ==========================================
// 1. REGISTRAR USUARIO
// ==========================================

// Creamos una cuenta nueva.
const registrar = (req, res) => {

    // Obtenemos los datos enviados desde el frontend.
    const { nombre, email, password } = req.body;

    // Comprobamos que los campos estén completos.
    if (!nombre || !email || !password) {
        return res.status(400).json({
            mensaje: "Todos los campos son obligatorios"
        });
    }

    // Comprobamos que los datos sean textos (evita errores 500
    // si alguien manda, por ejemplo, un número en vez de un texto).
    if (
        typeof nombre !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string"
    ) {
        return res.status(400).json({
            mensaje: "Los datos enviados no tienen el formato correcto"
        });
    }

    // Comprobamos el largo del nombre (mismas reglas que el frontend).
    if (nombre.trim().length < 3) {
        return res.status(400).json({
            mensaje: "El nombre debe tener al menos 3 caracteres"
        });
    }

    if (nombre.trim().length > 100) {
        return res.status(400).json({
            mensaje: "El nombre no puede superar los 100 caracteres"
        });
    }

    // Normalizamos el correo electrónico.
    const emailNormalizado = email.trim().toLowerCase();

    // Comprobamos que el correo tenga un formato válido.
    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(emailNormalizado) || emailNormalizado.length > 150) {
        return res.status(400).json({
            mensaje: "El correo electrónico no es válido"
        });
    }

    // Comprobamos que la contraseña tenga al menos 8 caracteres.
    if (password.length < 8) {
        return res.status(400).json({
            mensaje: "La contraseña debe tener al menos 8 caracteres"
        });
    }

    // Buscamos si el correo ya está registrado.
    usuarioModel.buscarPorEmail(emailNormalizado, (error, resultados) => {

        // Comprobamos si ocurrió un error en MySQL.
        if (error) {
            return res.status(500).json({
                mensaje: "Error al consultar los usuarios"
            });
        }

        // Evitamos registrar dos cuentas con el mismo correo.
        if (resultados.length > 0) {
            return res.status(409).json({
                mensaje: "El correo electrónico ya está registrado"
            });
        }

        // Generamos un hash de la contraseña.
        bcrypt.hash(password, 10, (errorHash, passwordHash) => {

            // Comprobamos si ocurrió un error al proteger la contraseña.
            if (errorHash) {
                return res.status(500).json({
                    mensaje: "Error al proteger la contraseña"
                });
            }

            // Preparamos los datos del nuevo usuario.
            const datos = {
                nombre: nombre.trim(),
                email: emailNormalizado,
                password_hash: passwordHash
            };

            // Guardamos el usuario en MySQL.
            usuarioModel.registrar(datos, (errorRegistro, resultado) => {

                // Comprobamos si ocurrió un error al registrar.
                if (errorRegistro) {
                    return res.status(500).json({
                        mensaje: "Error al registrar el usuario"
                    });
                }

                // Informamos que el registro fue exitoso.
                res.status(201).json({
                    mensaje: "Usuario registrado correctamente",
                    id_usuario: resultado.insertId
                });
            });
        });
    });
};


// ==========================================
// 2. INICIAR SESION
// ==========================================

// Verificamos las credenciales del usuario.
const login = (req, res) => {

    // Obtenemos el correo y la contraseña.
    const { email, password } = req.body;

    // Comprobamos que los campos estén completos.
    if (!email || !password) {
        return res.status(400).json({
            mensaje: "El correo y la contraseña son obligatorios"
        });
    }

    // Comprobamos que sean textos.
    if (typeof email !== "string" || typeof password !== "string") {
        return res.status(400).json({
            mensaje: "Los datos enviados no tienen el formato correcto"
        });
    }

    // Normalizamos el correo electrónico.
    const emailNormalizado = email.trim().toLowerCase();

    // Buscamos el usuario por su correo.
    usuarioModel.buscarPorEmail(emailNormalizado, (error, resultados) => {

        // Comprobamos si ocurrió un error en MySQL.
        if (error) {
            return res.status(500).json({
                mensaje: "Error al consultar el usuario"
            });
        }

        // Comprobamos si el usuario existe.
        if (resultados.length === 0) {
            return res.status(401).json({
                mensaje: "Correo o contraseña incorrectos"
            });
        }

        // Obtenemos los datos del usuario encontrado.
        const usuario = resultados[0];

        // Comparamos la contraseña recibida con el hash guardado.
        bcrypt.compare(password, usuario.password_hash, (errorComparacion, coincide) => {

            // Comprobamos si ocurrió un error.
            if (errorComparacion) {
                return res.status(500).json({
                    mensaje: "Error al verificar la contraseña"
                });
            }

            // Rechazamos las credenciales incorrectas.
            if (!coincide) {
                return res.status(401).json({
                    mensaje: "Correo o contraseña incorrectos"
                });
            }

            // Generamos un token de autenticación.
            const token = jwt.sign(
                {
                    id_usuario: usuario.id_usuario
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "8h"
                }
            );

            // Devolvemos el token y los datos públicos del usuario.
            res.json({
                mensaje: "Inicio de sesión correcto",
                token,
                usuario: {
                    id_usuario: usuario.id_usuario,
                    nombre: usuario.nombre,
                    email: usuario.email
                }
            });
        });
    });
};


// ==========================================
// EXPORTAR FUNCIONES
// ==========================================

// Exportamos las funciones para utilizarlas en las rutas.
module.exports = {
    registrar,
    login
};
