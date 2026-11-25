
import useFetch from "./useFetch";

// ==========================================
// HOOK PERSONALIZADO PARA LOS PRODUCTOS
// ==========================================
// Reutiliza useFetch y le pone nombres claros para la página de productos.
export default function useProductos() {
    const {
        datos: productos,
        cargando,
        error,
        setError,
        recargar: cargarProductos
    } = useFetch("/productos");

    return {
        productos,
        cargando,
        error,
        setError,
        cargarProductos
    };
}
