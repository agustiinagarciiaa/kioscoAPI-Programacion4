
import { useEffect, useState } from "react";
import { solicitar } from "../services/api";
import useFetch from "../hooks/useFetch";
import { coincideBusqueda } from "../utils/buscar";

// Validamos los datos con las mismas reglas que el backend.
const validarCategoria = (nombre, descripcion) => {
    if (!nombre.trim()) {
        return "El nombre de la categoría es obligatorio.";
    }

    if (nombre.trim().length > 100) {
        return "El nombre no puede superar los 100 caracteres.";
    }

    if (descripcion.trim().length > 255) {
        return "La descripción no puede superar los 255 caracteres.";
    }

    return "";
};

function Categorias() {
    // Pedimos las categorías con el hook genérico.
    const {
        datos: categorias,
        cargando,
        error,
        setError,
        recargar: cargarCategorias
    } = useFetch("/categorias");

    // Formulario de registro (arriba de la página).
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [mensaje, setMensaje] = useState("");

    // Texto del buscador de la tabla.
    const [busqueda, setBusqueda] = useState("");

    // Categorías que coinciden con lo que se escribió en el buscador.
    const categoriasFiltradas = categorias.filter((categoria) =>
        coincideBusqueda(busqueda, [categoria.nombre, categoria.descripcion])
    );

    // Ventana de edición: null cuando está cerrada.
    const [categoriaEditando, setCategoriaEditando] = useState(null);
    const [errorEdicion, setErrorEdicion] = useState("");
    const [guardandoEdicion, setGuardandoEdicion] = useState(false);

    const limpiarFormulario = () => {
        setNombre("");
        setDescripcion("");
    };

    const cerrarEdicion = () => {
        setCategoriaEditando(null);
        setErrorEdicion("");
    };

    // La ventana también se cierra con la tecla Escape.
    useEffect(() => {
        if (!categoriaEditando) return;

        const manejarTecla = (e) => {
            if (e.key === "Escape") {
                cerrarEdicion();
            }
        };

        window.addEventListener("keydown", manejarTecla);

        return () => window.removeEventListener("keydown", manejarTecla);
    }, [categoriaEditando]);

    const registrarCategoria = async (e) => {
        e.preventDefault();

        const mensajeValidacion = validarCategoria(nombre, descripcion);

        if (mensajeValidacion) {
            setMensaje("");
            setError(mensajeValidacion);
            return;
        }

        try {
            setError("");
            setMensaje("");

            await solicitar("/categorias", {
                method: "POST",
                body: JSON.stringify({
                    nombre: nombre.trim(),
                    descripcion: descripcion.trim()
                })
            });

            setMensaje("Categoría registrada correctamente.");
            limpiarFormulario();
            cargarCategorias();
        } catch (err) {
            setError(err.message);
        }
    };

    const editarCategoria = (categoria) => {
        setCategoriaEditando({
            id: categoria.id_categoria,
            nombre: categoria.nombre,
            descripcion: categoria.descripcion || ""
        });
        setErrorEdicion("");
        setError("");
        setMensaje("");
    };

    const guardarEdicion = async (e) => {
        e.preventDefault();

        const mensajeValidacion = validarCategoria(
            categoriaEditando.nombre,
            categoriaEditando.descripcion
        );

        if (mensajeValidacion) {
            setErrorEdicion(mensajeValidacion);
            return;
        }

        try {
            setGuardandoEdicion(true);
            setErrorEdicion("");

            await solicitar(`/categorias/${categoriaEditando.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    nombre: categoriaEditando.nombre.trim(),
                    descripcion: categoriaEditando.descripcion.trim()
                })
            });

            cerrarEdicion();
            setMensaje("Categoría modificada correctamente.");
            cargarCategorias();
        } catch (err) {
            setErrorEdicion(err.message);
        } finally {
            setGuardandoEdicion(false);
        }
    };

    const eliminarCategoria = async (id) => {
        const confirmar = window.confirm(
            "¿Estás seguro de eliminar esta categoría?\n\nSolo se puede eliminar si no tiene productos."
        );

        if (!confirmar) return;

        try {
            setError("");
            setMensaje("");

            await solicitar(`/categorias/${id}`, {
                method: "DELETE"
            });

            setMensaje("Categoría eliminada correctamente.");
            cargarCategorias();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <main className="pagina-inventario">
            <header className="encabezado-dashboard">
                <div>
                    <h1>Gestión de categorías</h1>
                    <p>Organizá los productos de tu kiosco.</p>
                </div>
            </header>

            <section className="seccion-inventario">
                <h2>Registrar categoría</h2>

                <form
                    className="formulario-inventario"
                    onSubmit={registrarCategoria}
                >
                    {/* Cada campo agrupa su etiqueta y su input */}
                    <div className="campo">
                        <label htmlFor="nombreCategoria">Nombre</label>
                        <input
                            id="nombreCategoria"
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Nombre de la categoría"
                            maxLength={100}
                            required
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="descripcionCategoria">Descripción</label>
                        <input
                            id="descripcionCategoria"
                            type="text"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Descripción"
                            maxLength={255}
                        />
                    </div>

                    {/* Botones en una fila aparte */}
                    <div className="acciones-formulario">
                        <button type="submit">Registrar categoría</button>
                    </div>
                </form>

                {error && <p className="mensaje-error">{error}</p>}
                {mensaje && <p className="mensaje-exito">{mensaje}</p>}
            </section>

            <section className="seccion-inventario">
                <div className="encabezado-tabla">
                    <h2>Categorías registradas</h2>

                    <input
                        type="search"
                        className="buscador"
                        aria-label="Buscar"
                        placeholder="Buscar por nombre o descripción"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                {cargando ? (
                    <p>Cargando categorías...</p>
                ) : (
                    <div className="tabla-contenedor">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {categoriasFiltradas.map((categoria) => (
                                    <tr key={categoria.id_categoria}>
                                        <td>{categoria.nombre}</td>
                                        <td>{categoria.descripcion}</td>
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    editarCategoria(categoria)
                                                }
                                            >
                                                Editar
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    eliminarCategoria(
                                                        categoria.id_categoria
                                                    )
                                                }
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {categoriasFiltradas.length === 0 && (
                                    <tr>
                                        <td colSpan="3">
                                            {categorias.length === 0
                                                ? "No hay categorías registradas."
                                                : `No se encontraron categorías para "${busqueda}".`}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* VENTANA EMERGENTE PARA MODIFICAR UNA CATEGORÍA */}
            {categoriaEditando && (
                <div className="modal-fondo" onClick={cerrarEdicion}>
                    <div
                        className="modal-ventana"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="tituloModalCategoria"
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

                        <h2 id="tituloModalCategoria">Modificar categoría</h2>

                        <form
                            className="formulario-inventario"
                            onSubmit={guardarEdicion}
                        >
                            <div className="campo">
                                <label htmlFor="editarNombreCategoria">Nombre</label>
                                <input
                                    id="editarNombreCategoria"
                                    type="text"
                                    value={categoriaEditando.nombre}
                                    onChange={(e) =>
                                        setCategoriaEditando({
                                            ...categoriaEditando,
                                            nombre: e.target.value
                                        })
                                    }
                                    maxLength={100}
                                    autoFocus
                                    required
                                />
                            </div>

                            <div className="campo">
                                <label htmlFor="editarDescripcionCategoria">
                                    Descripción
                                </label>
                                <input
                                    id="editarDescripcionCategoria"
                                    type="text"
                                    value={categoriaEditando.descripcion}
                                    onChange={(e) =>
                                        setCategoriaEditando({
                                            ...categoriaEditando,
                                            descripcion: e.target.value
                                        })
                                    }
                                    maxLength={255}
                                />
                            </div>

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

export default Categorias;
