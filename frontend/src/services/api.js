
// ==========================================
// SERVICIO DE COMUNICACION CON LA API
// ==========================================

// Direccion principal del backend.
const API_URL = "http://localhost:3000/api";

// Funcion general para comunicarnos con el servidor.
export const solicitar = async (ruta, opciones = {}) => {
    try {
        // Recuperamos el token de la sesion.
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

        // Leemos la respuesta del servidor.
        const texto = await respuesta.text();

        // Convertimos la respuesta a JSON.
        let datos;

        try {
            datos = texto ? JSON.parse(texto) : {};
        } catch {
            throw new Error("El servidor devolvio una respuesta invalida.");
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
        console.error("Error al comunicarse con la API:", error);
        throw error;
    }
};
