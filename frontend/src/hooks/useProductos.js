
import { useCallback, useEffect, useState } from "react";
import { solicitar } from "../services/api";

// Hook personalizado para administrar los productos.
export default function useProductos() {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    // Obtener los productos desde la API.
    const cargarProductos = useCallback(async () => {
        setCargando(true);

        try {
            const datos = await solicitar("/productos");

            setProductos(datos);
            setError("");

            return datos;
        } catch (err) {
            setError(
                err.message || "No se pudieron cargar los productos."
            );

            return null;
        } finally {
            setCargando(false);
        }
    }, []);

    // Cargar productos automáticamente al utilizar el hook.
    useEffect(() => {
        let activo = true;

        const obtenerProductos = async () => {
            try {
                const datos = await solicitar("/productos");

                if (activo) {
                    setProductos(datos);
                    setError("");
                }
            } catch (err) {
                if (activo) {
                    setError(
                        err.message || "No se pudieron cargar los productos."
                    );
                }
            } finally {
                if (activo) {
                    setCargando(false);
                }
            }
        };

        obtenerProductos();

        return () => {
            activo = false;
        };
    }, []);

    return {
        productos,
        cargando,
        error,
        cargarProductos,
        setProductos,
        setError
    };
}
