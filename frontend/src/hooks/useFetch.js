
import { useCallback, useEffect, useState } from "react";
import { solicitar } from "../services/api";

// ==========================================
// HOOK GENÉRICO PARA PEDIR DATOS A LA API
// ==========================================
// Uso: const { datos, cargando, error, recargar } = useFetch("/categorias");
//
// - datos:    lo que devolvió la API (empieza como lista vacía).
// - cargando: true mientras esperamos la respuesta.
// - error:    mensaje de error (o "" si no hubo).
// - recargar: vuelve a pedir los datos (por ejemplo, después de guardar).
export default function useFetch(ruta) {
    const [datos, setDatos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    // Cada vez que "version" cambia, el useEffect vuelve a ejecutarse.
    const [version, setVersion] = useState(0);

    useEffect(() => {
        // "activo" evita actualizar el estado si el componente ya se desmontó
        // (por ejemplo, si el usuario cambió de página antes de que llegue la respuesta).
        let activo = true;

        solicitar(ruta)
            .then((respuesta) => {
                if (activo) {
                    setDatos(respuesta);
                    setError("");
                }
            })
            .catch((err) => {
                if (activo) {
                    setError(err.message || "No se pudieron cargar los datos.");
                }
            })
            .finally(() => {
                if (activo) {
                    setCargando(false);
                }
            });

        return () => {
            activo = false;
        };
    }, [ruta, version]);

    // Volvemos a pedir los datos.
    const recargar = useCallback(() => {
        setCargando(true);
        setVersion((v) => v + 1);
    }, []);

    return {
        datos,
        cargando,
        error,
        setError,
        recargar
    };
}
