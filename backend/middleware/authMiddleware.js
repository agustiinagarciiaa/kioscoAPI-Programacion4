
// ==========================================
// MIDDLEWARE DE AUTENTICACION
// ==========================================

// Importamos jsonwebtoken para verificar los tokens.
const jwt = require("jsonwebtoken");


// ==========================================
// VERIFICAR TOKEN
// ==========================================

// Comprobamos si el usuario tiene una sesión válida.
const verificarToken = (req, res, next) => {

    // Obtenemos el encabezado de autorización.
    const autorizacion = req.headers.authorization;

    // Comprobamos si se envió el token.
    if (!autorizacion) {
        return res.status(401).json({
            mensaje: "Debés iniciar sesión para acceder"
        });
    }

    // Comprobamos que el encabezado tenga el formato Bearer.
    const partes = autorizacion.split(" ");

    if (partes.length !== 2 || partes[0] !== "Bearer" || !partes[1]) {
        return res.status(401).json({
            mensaje: "El formato del token no es válido"
        });
    }

    // Obtenemos el token enviado.
    const token = partes[1];

    // Verificamos que el token sea válido.
    jwt.verify(token, process.env.JWT_SECRET, (error, datos) => {

        // Si el token es incorrecto o venció, rechazamos el acceso.
        if (error) {
            return res.status(401).json({
                mensaje: "La sesión no es válida o ha vencido"
            });
        }

        // Guardamos el ID del usuario autenticado en la solicitud.
        req.usuario = datos;

        // Permitimos que continúe hacia el controlador.
        next();
    });
};


// ==========================================
// EXPORTAR MIDDLEWARE
// ==========================================

// Exportamos la función para proteger las rutas.
module.exports = verificarToken;
