
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { solicitar } from "../services/api";

function Reportes() {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    // Formateamos los importes como pesos argentinos.
    const formatoDinero = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS"
    });

    // Actualizamos el reporte cuando el usuario lo solicita.
    const cargarReporte = useCallback(async () => {
        setCargando(true);

        try {
            const datos = await solicitar("/productos");
            setProductos(datos);
            setError("");
        } catch (err) {
            setError(err.message || "No se pudo cargar el reporte.");
        } finally {
            setCargando(false);
        }
    }, []);

    // Cargamos los productos al entrar en la página.
    useEffect(() => {
        let activo = true;

        const obtenerReporte = async () => {
            try {
                const datos = await solicitar("/productos");

                if (activo) {
                    setProductos(datos);
                    setError("");
                }
            } catch (err) {
                if (activo) {
                    setError(err.message || "No se pudo cargar el reporte.");
                }
            } finally {
                if (activo) {
                    setCargando(false);
                }
            }
        };

        obtenerReporte();

        return () => {
            activo = false;
        };
    }, []);

    // Calculamos la cantidad de productos diferentes.
    const totalProductos = productos.length;

    // Calculamos todas las unidades disponibles.
    const totalUnidades = productos.reduce(
        (total, producto) => total + Number(producto.stock),
        0
    );

    // Contamos los productos que necesitan reposición.
    const productosStockBajo = productos.filter(
        (producto) =>
            Number(producto.stock) <= Number(producto.stock_minimo)
    );

    // Calculamos el valor del inventario.
    const valorInventario = productos.reduce(
        (total, producto) =>
            total + Number(producto.precio) * Number(producto.stock),
        0
    );

    // Descargamos el reporte en formato CSV.
    const descargarReporte = () => {
        const encabezados = [
            "Producto",
            "Precio",
            "Stock actual",
            "Stock minimo",
            "Categoria",
            "Valor total"
        ];

        const filas = productos.map((producto) => [
            producto.nombre,
            producto.precio,
            producto.stock,
            producto.stock_minimo,
            producto.categoria || producto.nombre_categoria || "Sin categoria",
            Number(producto.precio) * Number(producto.stock)
        ]);

        const contenido = [
            encabezados,
            ...filas
        ].map((fila) =>
            fila.map((dato) =>
                `"${String(dato).replace(/"/g, '""')}"`
            ).join(";")
        ).join("\n");

        const archivo = new Blob(
            ["\uFEFF" + contenido],
            { type: "text/csv;charset=utf-8;" }
        );

        const enlace = document.createElement("a");
        const url = URL.createObjectURL(archivo);

        enlace.href = url;
        enlace.download = "reporte_inventario_kiosco.csv";
        enlace.click();

        URL.revokeObjectURL(url);
    };

    return (
        <main className="pagina-inventario">
            <header className="encabezado-dashboard">
                <div>
                    <h1>Reportes del inventario</h1>
                    <p>Resumen general del kiosco.</p>
                </div>

                <Link to="/dashboard">Volver al inicio</Link>
            </header>

            {cargando ? (
                <p>Cargando reportes...</p>
            ) : error ? (
                <p className="mensaje-error">{error}</p>
            ) : (
                <>
                    <section className="resumen-reportes">
                        <article className="tarjeta-reporte">
                            <h3>Productos registrados</h3>
                            <p>{totalProductos}</p>
                        </article>

                        <article className="tarjeta-reporte">
                            <h3>Unidades en stock</h3>
                            <p>{totalUnidades}</p>
                        </article>

                        <article className="tarjeta-reporte">
                            <h3>Stock bajo</h3>
                            <p>{productosStockBajo.length}</p>
                        </article>

                        <article className="tarjeta-reporte">
                            <h3>Valor del inventario</h3>
                            <p>{formatoDinero.format(valorInventario)}</p>
                        </article>
                    </section>

                    <section className="seccion-inventario">
                        <h2>Detalle del inventario</h2>

                        {productos.length === 0 ? (
                            <p>No hay productos para mostrar.</p>
                        ) : (
                            <div className="tabla-contenedor">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Precio</th>
                                            <th>Stock</th>
                                            <th>Valor total</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {productos.map((producto) => (
                                            <tr key={producto.id_producto}>
                                                <td>{producto.nombre}</td>

                                                <td>
                                                    {formatoDinero.format(
                                                        Number(producto.precio)
                                                    )}
                                                </td>

                                                <td>{producto.stock}</td>

                                                <td>
                                                    {formatoDinero.format(
                                                        Number(producto.precio) *
                                                        Number(producto.stock)
                                                    )}
                                                </td>

                                                <td>
                                                    {Number(producto.stock) <=
                                                    Number(producto.stock_minimo)
                                                        ? "Stock bajo"
                                                        : "Disponible"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={descargarReporte}
                            disabled={productos.length === 0}
                            style={{ marginTop: "20px" }}
                        >
                            Descargar reporte CSV
                        </button>

                        <button
                            type="button"
                            onClick={cargarReporte}
                            style={{ marginTop: "20px", marginLeft: "10px" }}
                        >
                            Actualizar reporte
                        </button>
                    </section>
                </>
            )}
        </main>
    );
}

export default Reportes;
