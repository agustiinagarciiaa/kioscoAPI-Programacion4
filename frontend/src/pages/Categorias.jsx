
import { useState } from "react";
import { Link } from "react-router-dom";
import { solicitar } from "../services/api";
import useFetch from "../hooks/useFetch";

function Categorias() {
    // Pedimos las categorías con el hook genérico.
    const {
        datos: categorias,
        cargando,
        error,
        setError,
        recargar: cargarCategorias
    } = useFetch("/categorias");

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [idEditar, setIdEditar] = useState(null);
    const [mensaje, setMensaje] = useState("");

    const limpiarFormulario = () => {
        setNombre("");
        setDescripcion("");
        setIdEditar(null);
    };

    // Validamos el formulario con las mismas reglas que el backend.
    const validarFormulario = () => {
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

    const guardarCategoria = async (e) => {
        e.preventDefault();

        const mensajeValidacion = validarFormulario();

        if (mensajeValidacion) {
            setMensaje("");
            setError(mensajeValidacion);
            return;
        }

        try {
            setError("");
            setMensaje("");

            const datos = {
                nombre: nombre.trim(),
                descripcion: descripcion.trim()
            };

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
            cargarCategorias();
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
                        <button type="submit">
                            {idEditar ? "Guardar cambios" : "Registrar categoría"}
                        </button>

                        {idEditar && (
                            <button type="button" onClick={limpiarFormulario}>
                                Cancelar edición
                            </button>
                        )}
                    </div>
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
