
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { solicitar } from "../services/api";

function StockBajo() {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    // Permite actualizar el inventario desde el botón.
    const cargarStockBajo = useCallback(async () => {
        setCargando(true);

        try {
            const datos = await solicitar("/productos/stock-bajo");
            setProductos(datos);
            setError("");
        } catch (err) {
            setError(err.message || "No se pudo cargar el inventario.");
        } finally {
            setCargando(false);
        }
    }, []);

    // Consultamos los productos al abrir la página.
    useEffect(() => {
        let activo = true;

        const obtenerStockBajo = async () => {
            try {
                const datos = await solicitar("/productos/stock-bajo");

                if (activo) {
                    setProductos(datos);
                    setError("");
                }
            } catch (err) {
                if (activo) {
                    setError(err.message || "No se pudo cargar el inventario.");
                }
            } finally {
                if (activo) {
                    setCargando(false);
                }
            }
        };

        obtenerStockBajo();

        return () => {
            activo = false;
        };
    }, []);

    return (
        <main className="pagina-inventario">
            <header className="encabezado-dashboard">
                <div>
                    <h1>Control de stock bajo</h1>
                    <p>Productos que necesitan reposición.</p>
                </div>

                <Link to="/dashboard">Volver al inicio</Link>
            </header>

            <section className="seccion-inventario">
                <h2>Productos que necesitan reposición</h2>

                {cargando ? (
                    <p>Cargando inventario...</p>
                ) : error ? (
                    <p className="mensaje-error">{error}</p>
                ) : productos.length === 0 ? (
                    <p>
                        ¡Excelente! No hay productos con stock bajo.
                    </p>
                ) : (
                    <>
                        <p>
                            Hay {productos.length} producto(s) que necesitan
                            reposición.
                        </p>

                        <div className="tabla-contenedor">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Stock actual</th>
                                        <th>Stock mínimo</th>
                                        <th>Categoría</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {productos.map((producto) => (
                                        <tr key={producto.id_producto}>
                                            <td>{producto.nombre}</td>
                                            <td>{producto.stock}</td>
                                            <td>{producto.stock_minimo}</td>
                                            <td>
                                                {producto.categoria ||
                                                    producto.nombre_categoria ||
                                                    "Sin categoría"}
                                            </td>
                                            <td>
                                                <strong>
                                                    Necesita reposición
                                                </strong>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                <button
                    type="button"
                    onClick={cargarStockBajo}
                    disabled={cargando}
                    style={{ marginTop: "20px" }}
                >
                    Actualizar inventario
                </button>
            </section>
        </main>
    );
}

export default StockBajo;
