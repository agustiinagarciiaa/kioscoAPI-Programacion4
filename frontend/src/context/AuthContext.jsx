
import { useEffect, useState } from "react";
import { solicitar, EVENTO_SESION_EXPIRADA } from "../services/api";
import { AuthContext } from "./AuthContextBase";

// Revisamos si el token ya venció leyendo su fecha de expiración ("exp").
// Un JWT tiene 3 partes separadas por puntos; la del medio son los datos.
const tokenVencido = (token) => {
    try {
        const base64 = token.split(".")[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const datos = JSON.parse(atob(base64));

        return !datos.exp || datos.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

// Leemos la sesión guardada en el navegador (si es válida).
const leerSesionGuardada = () => {
    try {
        const token = localStorage.getItem("token");
        const guardado = localStorage.getItem("usuario");

        if (!token || !guardado || tokenVencido(token)) {
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            return null;
        }

        return JSON.parse(guardado);
    } catch {
        return null;
    }
};

// Administramos la sesión del usuario.
export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(leerSesionGuardada);

    // Si la API avisa que la sesión venció (respuesta 401),
    // cerramos la sesión y RutaPrivada nos manda al login.
    useEffect(() => {
        const alExpirarSesion = () => {
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            setUsuario(null);
        };

        window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirarSesion);

        return () => {
            window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirarSesion);
        };
    }, []);

    // Iniciamos sesión.
    const login = async (email, password) => {
        const datos = await solicitar("/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email,
                password
            })
        });

        localStorage.setItem("token", datos.token);
        localStorage.setItem("usuario", JSON.stringify(datos.usuario));

        setUsuario(datos.usuario);

        return datos;
    };

    // Registramos un usuario.
    const registrar = async (nombre, email, password) => {
        return await solicitar("/auth/registro", {
            method: "POST",
            body: JSON.stringify({
                nombre,
                email,
                password
            })
        });
    };

    // Cerramos sesión.
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        setUsuario(null);
    };

    return (
        <AuthContext.Provider
            value={{
                usuario,
                login,
                registrar,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
