
import { useEffect, useState } from "react";
import { solicitar } from "../services/api";
import useProductos from "../hooks/useProductos";
import useFetch from "../hooks/useFetch";
import { coincideBusqueda } from "../utils/buscar";

// Valores iniciales del formulario de registro.
const PRODUCTO_VACIO = {
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    stockMinimo: "5",
    idCategoria: ""
};

// Validamos los datos con las mismas reglas que el backend.
const validarProducto = (datos) => {
    const { nombre, descripcion, precio, stock, stockMinimo, idCategoria } = datos;

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

// Convertimos los datos del formulario al formato que espera la API.
const armarDatosApi = (datos) => ({
    nombre: datos.nombre.trim(),
    descripcion: datos.descripcion.trim(),
    precio: Number(datos.precio),
    stock: Number(datos.stock),
    stock_minimo: Number(datos.stockMinimo),
    id_categoria: Number(datos.idCategoria)
});

// Campos del producto. Se usan en el registro y en la ventana de edición;
// "prefijo" evita que los ids se repitan entre los dos formularios.
function CamposProducto({ datos, cambiar, categorias, prefijo }) {
    const id = (nombreCampo) => `${prefijo}${nombreCampo}`;

    return (
        <>
            {/* Cada campo agrupa su etiqueta y su input */}
            <div className="campo">
                <label htmlFor={id("nombre")}>Nombre</label>
                <input
                    id={id("nombre")}
                    type="text"
                    maxLength={150}
                    value={datos.nombre}
                    onChange={(e) => cambiar("nombre", e.target.value)}
                    autoFocus={prefijo === "editar-"}
                    required
                />
            </div>

            <div className="campo">
                <label htmlFor={id("descripcion")}>Descripción</label>
                <input
                    id={id("descripcion")}
                    type="text"
                    maxLength={255}
                    value={datos.descripcion}
                    onChange={(e) => cambiar("descripcion", e.target.value)}
                />
            </div>

            <div className="campo">
                <label htmlFor={id("precio")}>Precio</label>
                <input
                    id={id("precio")}
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={datos.precio}
                    onChange={(e) => cambiar("precio", e.target.value)}
                    required
                />
            </div>

            <div className="campo">
                <label htmlFor={id("stock")}>Stock actual</label>
                <input
                    id={id("stock")}
                    type="number"
                    min="0"
                    step="1"
                    value={datos.stock}
                    onChange={(e) => cambiar("stock", e.target.value)}
                    required
                />
            </div>

            <div className="campo">
                <label htmlFor={id("stockMinimo")}>Stock mínimo</label>
                <input
                    id={id("stockMinimo")}
                    type="number"
                    min="0"
                    step="1"
                    value={datos.stockMinimo}
                    onChange={(e) => cambiar("stockMinimo", e.target.value)}
                    required
                />
            </div>

            <div className="campo">
                <label htmlFor={id("categoria")}>Categoría</label>
                <select
                    id={id("categoria")}
                    value={datos.idCategoria}
                    onChange={(e) => cambiar("idCategoria", e.target.value)}
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
        </>
    );
}

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

    // Formulario de registro (arriba de la página).
    const [nuevoProducto, setNuevoProducto] = useState(PRODUCTO_VACIO);
    const [mensaje, setMensaje] = useState("");

    // Texto del buscador de la tabla.
    const [busqueda, setBusqueda] = useState("");
    const [guardando, setGuardando] = useState(false);

    // Ventana de edición: null cuando está cerrada.
    const [productoEditando, setProductoEditando] = useState(null);
    const [errorEdicion, setErrorEdicion] = useState("");
    const [guardandoEdicion, setGuardandoEdicion] = useState(false);

    // Productos que coinciden con lo que se escribió en el buscador.
    const productosFiltrados = productos.filter((producto) =>
        coincideBusqueda(busqueda, [
            producto.nombre,
            producto.descripcion,
            producto.categoria
        ])
    );

    const cambiarNuevo = (campo, valor) => {
        setNuevoProducto((anterior) => ({ ...anterior, [campo]: valor }));
    };

    const cambiarEdicion = (campo, valor) => {
        setProductoEditando((anterior) => ({ ...anterior, [campo]: valor }));
    };

    const cerrarEdicion = () => {
        setProductoEditando(null);
        setErrorEdicion("");
    };

    // La ventana también se cierra con la tecla Escape.
    useEffect(() => {
        if (!productoEditando) return;

        const manejarTecla = (e) => {
            if (e.key === "Escape") {
                cerrarEdicion();
            }
        };

        window.addEventListener("keydown", manejarTecla);

        return () => window.removeEventListener("keydown", manejarTecla);
    }, [productoEditando]);

    const registrarProducto = async (e) => {
        e.preventDefault();

        const mensajeValidacion = validarProducto(nuevoProducto);

        if (mensajeValidacion) {
            setMensaje("");
            setError(mensajeValidacion);
            return;
        }

        try {
            setGuardando(true);
            setError("");
            setMensaje("");

            await solicitar("/productos", {
                method: "POST",
                body: JSON.stringify(armarDatosApi(nuevoProducto))
            });

            setMensaje("Producto registrado correctamente.");
            setNuevoProducto(PRODUCTO_VACIO);
            cargarProductos();
        } catch (err) {
            setError(err.message);
        } finally {
            setGuardando(false);
        }
    };

    const editarProducto = (producto) => {
        setProductoEditando({
            id: producto.id_producto,
            nombre: producto.nombre,
            descripcion: producto.descripcion || "",
            precio: String(producto.precio),
            stock: String(producto.stock),
            stockMinimo: String(producto.stock_minimo),
            idCategoria: String(producto.id_categoria)
        });
        setErrorEdicion("");
        setMensaje("");
        setError("");
    };

    const guardarEdicion = async (e) => {
        e.preventDefault();

        const mensajeValidacion = validarProducto(productoEditando);

        if (mensajeValidacion) {
            setErrorEdicion(mensajeValidacion);
            return;
        }

        try {
            setGuardandoEdicion(true);
            setErrorEdicion("");

            await solicitar(`/productos/${productoEditando.id}`, {
                method: "PUT",
                body: JSON.stringify(armarDatosApi(productoEditando))
            });

            cerrarEdicion();
            setMensaje("Producto modificado correctamente.");
            cargarProductos();
        } catch (err) {
            setErrorEdicion(err.message);
        } finally {
            setGuardandoEdicion(false);
        }
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
            </header>

            <section className="seccion-inventario">
                <h2>Registrar producto</h2>

                <form
                    className="formulario-inventario"
                    onSubmit={registrarProducto}
                >
                    <CamposProducto
                        datos={nuevoProducto}
                        cambiar={cambiarNuevo}
                        categorias={categorias}
                        prefijo=""
                    />

                    {/* Botones en una fila aparte */}
                    <div className="acciones-formulario">
                        <button
                            type="submit"
                            disabled={guardando || cargandoCategorias}
                        >
                            {guardando ? "Guardando..." : "Registrar producto"}
                        </button>
                    </div>
                </form>

                {errorCategorias && (
                    <p className="mensaje-error">{errorCategorias}</p>
                )}
                {error && <p className="mensaje-error">{error}</p>}
                {mensaje && <p className="mensaje-exito">{mensaje}</p>}
            </section>

            <section className="seccion-inventario">
                <div className="encabezado-tabla">
                    <h2>Productos registrados</h2>

                    <input
                        type="search"
                        className="buscador"
                        aria-label="Buscar"
                        placeholder="Buscar por nombre, descripción o categoría"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                {cargando ? (
                    <p>Cargando productos...</p>
                ) : productos.length === 0 ? (
                    <p>No hay productos registrados.</p>
                ) : productosFiltrados.length === 0 ? (
                    <p>No se encontraron productos para "{busqueda}".</p>
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
                                {productosFiltrados.map((producto) => (
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

            {/* VENTANA EMERGENTE PARA MODIFICAR UN PRODUCTO */}
            {productoEditando && (
                <div className="modal-fondo" onClick={cerrarEdicion}>
                    <div
                        className="modal-ventana modal-ancha"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="tituloModalProducto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="modal-cerrar"
                            onClick={cerrarEdicion}
                            aria-label="Cerrar"
                        >
                            ×
                        </button>

                        <h2 id="tituloModalProducto">Modificar producto</h2>

                        <form
                            className="formulario-inventario"
                            onSubmit={guardarEdicion}
                        >
                            <CamposProducto
                                datos={productoEditando}
                                cambiar={cambiarEdicion}
                                categorias={categorias}
                                prefijo="editar-"
                            />

                            {errorEdicion && (
                                <p className="mensaje-error">{errorEdicion}</p>
                            )}

                            <div className="acciones-formulario">
                                <button type="submit" disabled={guardandoEdicion}>
                                    {guardandoEdicion ? "Guardando..." : "Guardar cambios"}
                                </button>

                                <button type="button" onClick={cerrarEdicion}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Productos;
