
import { createContext, useContext } from "react";

// Contexto compartido de autenticacion.
export const AuthContext = createContext(null);

// Hook para acceder a la sesion del usuario.
export function useAuth() {
    return useContext(AuthContext);
}
