
// ==========================================
// SERVICIO DE COMUNICACION CON LA API
// ==========================================

// Dirección principal del backend.
// Se puede cambiar con la variable VITE_API_URL (archivo frontend/.env).
// Si no existe, usamos la dirección local por defecto.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Nombre del evento que avisa que la sesión venció.
// AuthContext lo escucha y cierra la sesión automáticamente.
export const EVENTO_SESION_EXPIRADA = "sesion-expirada";

// Función general para comunicarnos con el servidor.
export const solicitar = async (ruta, opciones = {}) => {
    try {
        // Recuperamos el token de la sesión.
        const token = localStorage.getItem("token");

        // Preparamos los encabezados.
        const encabezados = {
            "Content-Type": "application/json",
            ...opciones.headers
        };

        // Enviamos el token si existe.
        if (token) {
            encabezados.Authorization = `Bearer ${token}`;
        }

        // Realizamos la solicitud.
        const respuesta = await fetch(`${API_URL}${ruta}`, {
            ...opciones,
            headers: encabezados
        });

        // Si el servidor responde 401 en una ruta privada, el token venció
        // o no es válido: avisamos para cerrar la sesión.
        // (En /auth/login un 401 solo significa "contraseña incorrecta").
        if (respuesta.status === 401 && token && !ruta.startsWith("/auth/")) {
            window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA));
        }

        // Leemos la respuesta del servidor.
        const texto = await respuesta.text();

        // Convertimos la respuesta a JSON.
        let datos;

        try {
            datos = texto ? JSON.parse(texto) : {};
        } catch {
            throw new Error("El servidor devolvió una respuesta inválida.");
        }

        // Controlamos los errores HTTP.
        if (!respuesta.ok) {
            throw new Error(
                datos.mensaje || `Error del servidor: ${respuesta.status}`
            );
        }

        // Devolvemos los datos.
        return datos;

    } catch (error) {
        // fetch falla con TypeError cuando el backend no está encendido.
        if (error instanceof TypeError) {
            console.error("No se pudo conectar con la API:", error);
            throw new Error(
                "No se pudo conectar con el servidor. ¿Está encendido el backend?",
                { cause: error }
            );
        }

        console.error("Error al comunicarse con la API:", error);
        throw error;
    }
};
