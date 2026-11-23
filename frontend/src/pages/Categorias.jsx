
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { solicitar } from "../services/api";

function Categorias() {
    const [categorias, setCategorias] = useState([]);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [idEditar, setIdEditar] = useState(null);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(true);

    const cargarCategorias = useCallback(async () => {
        try {
            const datos = await solicitar("/categorias");
            setCategorias(datos);
            setError("");
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        let activo = true;

        const obtenerCategorias = async () => {
            try {
                const datos = await solicitar("/categorias");

                if (activo) {
                    setCategorias(datos);
                    setError("");
                }
            } catch (err) {
                if (activo) {
                    setError(err.message);
                }
            } finally {
                if (activo) {
                    setCargando(false);
                }
            }
        };

        obtenerCategorias();

        return () => {
            activo = false;
        };
    }, []);

    const limpiarFormulario = () => {
        setNombre("");
        setDescripcion("");
        setIdEditar(null);
    };

    const guardarCategoria = async (e) => {
        e.preventDefault();

        try {
            setError("");
            setMensaje("");

            const datos = { nombre, descripcion };

            if (idEditar) {
                await solicitar(`/categorias/${idEditar}`, {
                    method: "PUT",
                    body: JSON.stringify(datos)
                });

                setMensaje("Categoría modificada correctamente.");
            } else {
                await solicitar("/categorias", {
                    method: "POST",
                    body: JSON.stringify(datos)
                });

                setMensaje("Categoría registrada correctamente.");
            }

            limpiarFormulario();
            await cargarCategorias();
        } catch (err) {
            setError(err.message);
        }
    };

    const editarCategoria = (categoria) => {
        setIdEditar(categoria.id_categoria);
        setNombre(categoria.nombre);
        setDescripcion(categoria.descripcion || "");
        setError("");
        setMensaje("");
    };

    const eliminarCategoria = async (id) => {
        const confirmar = window.confirm(
            "¿Estás seguro de eliminar esta categoría?"
        );

        if (!confirmar) return;

        try {
            setError("");
            setMensaje("");

            await solicitar(`/categorias/${id}`, {
                method: "DELETE"
            });

            setMensaje("Categoría eliminada correctamente.");
            await cargarCategorias();
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

                <Link to="/dashboard">Volver al inicio</Link>
            </header>

            <section className="seccion-inventario">
                <h2>
                    {idEditar ? "Modificar categoría" : "Registrar categoría"}
                </h2>

                <form
                    className="formulario-inventario"
                    onSubmit={guardarCategoria}
                >
                    <label htmlFor="nombreCategoria">Nombre</label>
                    <input
                        id="nombreCategoria"
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Nombre de la categoría"
                        required
                    />

                    <label htmlFor="descripcionCategoria">Descripción</label>
                    <input
                        id="descripcionCategoria"
                        type="text"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Descripción"
                    />

                    <button type="submit">
                        {idEditar ? "Guardar cambios" : "Registrar categoría"}
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
                <h2>Categorías registradas</h2>

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
                                {categorias.map((categoria) => (
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

                                {categorias.length === 0 && (
                                    <tr>
                                        <td colSpan="3">
                                            No hay categorías registradas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </main>
    );
}

export default Categorias;
