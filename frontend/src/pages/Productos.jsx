
import { useState } from "react";
import { Link } from "react-router-dom";
import { solicitar } from "../services/api";
import useProductos from "../hooks/useProductos";
import useFetch from "../hooks/useFetch";

function Productos() {
    const {
        productos,
        cargando,
        error,
        cargarProductos,
        setError
    } = useProductos();

    // Las categorías se usan para llenar el <select> del formulario.
    const {
        datos: categorias,
        cargando: cargandoCategorias,
        error: errorCategorias
    } = useFetch("/categorias");

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");
    const [stockMinimo, setStockMinimo] = useState("5");
    const [idCategoria, setIdCategoria] = useState("");
    const [idEditar, setIdEditar] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [guardando, setGuardando] = useState(false);

    // Cargar categorías al abrir la página.
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

        if (nombre.trim().length > 150) {
            return "El nombre no puede superar los 150 caracteres.";
        }

        if (descripcion.trim().length > 255) {
            return "La descripción no puede superar los 255 caracteres.";
        }

        if (precio === "" || Number(precio) <= 0) {
            return "El precio debe ser mayor que cero.";
        }

        if (Number(precio) > 99999999.99) {
            return "El precio es demasiado alto.";
        }

        if (stock === "" || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
            return "El stock debe ser un número entero mayor o igual a cero.";
        }

        if (
            stockMinimo === "" ||
            !Number.isInteger(Number(stockMinimo)) ||
            Number(stockMinimo) < 0
        ) {
            return "El stock mínimo debe ser un número entero mayor o igual a cero.";
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
            setMensaje("");
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
            cargarProductos();
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
        setPrecio(String(producto.precio));
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
            cargarProductos();
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
                    {/* Cada campo agrupa su etiqueta y su input */}
                    <div className="campo">
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            id="nombre"
                            type="text"
                            maxLength={150}
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="descripcion">Descripción</label>
                        <input
                            id="descripcion"
                            type="text"
                            maxLength={255}
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                        />
                    </div>

                    <div className="campo">
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
                    </div>

                    <div className="campo">
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
                    </div>

                    <div className="campo">
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
                    </div>

                    <div className="campo">
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
                    </div>

                    {/* Botones en una fila aparte */}
                    <div className="acciones-formulario">
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
                    </div>
                </form>

                {errorCategorias && (
                    <p className="mensaje-error">{errorCategorias}</p>
                )}
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
