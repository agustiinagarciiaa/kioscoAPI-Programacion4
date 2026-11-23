
import { useState } from "react";
import { solicitar } from "../services/api";
import { AuthContext } from "./AuthContextBase";

// Administramos la sesion del usuario.
export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() => {
        const guardado = localStorage.getItem("usuario");

        return guardado ? JSON.parse(guardado) : null;
    });

    // Iniciamos sesion.
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

    // Cerramos sesion.
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
