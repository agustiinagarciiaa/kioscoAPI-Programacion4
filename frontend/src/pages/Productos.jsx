
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { solicitar } from "../services/api";
import useProductos from "../hooks/useProductos";

function Productos() {
    const {
        productos,
        cargando,
        error,
        cargarProductos,
        setError
    } = useProductos();

    const [categorias, setCategorias] = useState([]);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");
    const [stockMinimo, setStockMinimo] = useState("5");
    const [idCategoria, setIdCategoria] = useState("");
    const [idEditar, setIdEditar] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [guardando, setGuardando] = useState(false);
    const [cargandoCategorias, setCargandoCategorias] = useState(true);

    // Cargar categorías al abrir la página.
    useEffect(() => {
        let activo = true;

        const obtenerCategorias = async () => {
            try {
                const datos = await solicitar("/categorias");

                if (activo) {
                    setCategorias(datos);
                }
            } catch (err) {
                if (activo) {
                    setError(err.message);
                }
            } finally {
                if (activo) {
                    setCargandoCategorias(false);
                }
            }
        };

        obtenerCategorias();

        return () => {
            activo = false;
        };
    }, [setError]);

    const limpiarFormulario = () => {
        setNombre("");
        setDescripcion("");
        setPrecio("");
        setStock("");
        setStockMinimo("5");
        setIdCategoria("");
        setIdEditar(null);
    };

    const validarFormulario = () => {
        if (!nombre.trim()) {
            return "El nombre del producto es obligatorio.";
        }

        if (precio === "" || Number(precio) <= 0) {
            return "El precio debe ser mayor que cero.";
        }

        if (stock === "" || Number(stock) < 0) {
            return "El stock no puede ser negativo.";
        }

        if (stockMinimo === "" || Number(stockMinimo) < 0) {
            return "El stock mínimo no puede ser negativo.";
        }

        if (!idCategoria) {
            return "Seleccioná una categoría.";
        }

        return "";
    };

    const guardarProducto = async (e) => {
        e.preventDefault();

        const mensajeValidacion = validarFormulario();

        if (mensajeValidacion) {
            setError(mensajeValidacion);
            return;
        }

        try {
            setGuardando(true);
            setError("");
            setMensaje("");

            const datos = {
                nombre: nombre.trim(),
                descripcion: descripcion.trim(),
                precio: Number(precio),
                stock: Number(stock),
                stock_minimo: Number(stockMinimo),
                id_categoria: Number(idCategoria)
            };

            if (idEditar) {
                await solicitar(`/productos/${idEditar}`, {
                    method: "PUT",
                    body: JSON.stringify(datos)
                });

                setMensaje("Producto modificado correctamente.");
            } else {
                await solicitar("/productos", {
                    method: "POST",
                    body: JSON.stringify(datos)
                });

                setMensaje("Producto registrado correctamente.");
            }

            limpiarFormulario();
            await cargarProductos();
        } catch (err) {
            setError(err.message);
        } finally {
            setGuardando(false);
        }
    };

    const editarProducto = (producto) => {
        setIdEditar(producto.id_producto);
        setNombre(producto.nombre);
        setDescripcion(producto.descripcion || "");
        setPrecio(producto.precio);
        setStock(String(producto.stock));
        setStockMinimo(String(producto.stock_minimo));
        setIdCategoria(String(producto.id_categoria));
        setMensaje("");
        setError("");
    };

    const eliminarProducto = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este producto?")) {
            return;
        }

        try {
            setError("");
            setMensaje("");

            await solicitar(`/productos/${id}`, {
                method: "DELETE"
            });

            setMensaje("Producto eliminado correctamente.");
            await cargarProductos();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <main className="pagina-inventario">
            <header className="encabezado-dashboard">
                <div>
                    <h1>Gestión de productos</h1>
                    <p>Administrá el inventario de tu kiosco.</p>
                </div>

                <Link to="/dashboard">Volver al inicio</Link>
            </header>

            <section className="seccion-inventario">
                <h2>
                    {idEditar ? "Modificar producto" : "Registrar producto"}
                </h2>

                <form
                    className="formulario-inventario"
                    onSubmit={guardarProducto}
                >
                    <label htmlFor="nombre">Nombre</label>
                    <input
                        id="nombre"
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />

                    <label htmlFor="descripcion">Descripción</label>
                    <input
                        id="descripcion"
                        type="text"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                    />

                    <label htmlFor="precio">Precio</label>
                    <input
                        id="precio"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        required
                    />

                    <label htmlFor="stock">Stock actual</label>
                    <input
                        id="stock"
                        type="number"
                        min="0"
                        step="1"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                    />

                    <label htmlFor="stockMinimo">Stock mínimo</label>
                    <input
                        id="stockMinimo"
                        type="number"
                        min="0"
                        step="1"
                        value={stockMinimo}
                        onChange={(e) => setStockMinimo(e.target.value)}
                        required
                    />

                    <label htmlFor="categoria">Categoría</label>
                    <select
                        id="categoria"
                        value={idCategoria}
                        onChange={(e) => setIdCategoria(e.target.value)}
                        required
                    >
                        <option value="">Seleccioná una categoría</option>

                        {categorias.map((categoria) => (
                            <option
                                key={categoria.id_categoria}
                                value={categoria.id_categoria}
                            >
                                {categoria.nombre}
                            </option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        disabled={guardando || cargandoCategorias}
                    >
                        {guardando
                            ? "Guardando..."
                            : idEditar
                                ? "Guardar cambios"
                                : "Registrar producto"}
                    </button>

                    {idEditar && (
                        <button type="button" onClick={limpiarFormulario}>
                            Cancelar edición
                        </button>
                    )}
                </form>

                {error && <p className="mensaje-error">{error}</p>}
                {mensaje && <p className="mensaje-exito">{mensaje}</p>}
            </section>

            <section className="seccion-inventario">
                <h2>Productos registrados</h2>

                {cargando ? (
                    <p>Cargando productos...</p>
                ) : productos.length === 0 ? (
                    <p>No hay productos registrados.</p>
                ) : (
                    <div className="tabla-contenedor">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Stock mínimo</th>
                                    <th>Categoría</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {productos.map((producto) => (
                                    <tr key={producto.id_producto}>
                                        <td>{producto.nombre}</td>
                                        <td>
                                            ${Number(producto.precio).toFixed(2)}
                                        </td>
                                        <td>{producto.stock}</td>
                                        <td>{producto.stock_minimo}</td>
                                        <td>{producto.categoria || "Sin categoría"}</td>
                                        <td>
                                            {Number(producto.stock) <=
                                            Number(producto.stock_minimo)
                                                ? "Stock bajo"
                                                : "Disponible"}
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() => editarProducto(producto)}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    eliminarProducto(producto.id_producto)
                                                }
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </main>
    );
}

export default Productos;
