
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContextBase";

function Registro() {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState("");

    const { registrar } = useAuth();
    const navigate = useNavigate();

    // Registramos un nuevo usuario.
    const manejarRegistro = async (e) => {
        e.preventDefault();
        setError("");
        setMensaje("");

        if (!nombre.trim() || !email.trim() || !password) {
            setError("Completá todos los campos.");
            return;
        }

        if (nombre.trim().length < 3) {
            setError("El nombre debe tener al menos 3 caracteres.");
            return;
        }

        if (password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        try {
            setCargando(true);

            await registrar(nombre.trim(), email.trim(), password);

            setMensaje(
                "Cuenta creada correctamente. Redirigiendo al inicio de sesión..."
            );

            setTimeout(() => {
                navigate("/");
            }, 1800);

        } catch (err) {
            setError(err.message || "No se pudo crear la cuenta.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <main className="pagina-auth">
            <section className="tarjeta-auth">
                <h1>Inventario Kiosco</h1>
                <p>Creá tu cuenta para comenzar.</p>

                <h2>Registro de usuario</h2>

                <form onSubmit={manejarRegistro}>
                    <label htmlFor="nombre">Nombre completo</label>
                    <input
                        id="nombre"
                        type="text"
                        placeholder="Ingresá tu nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        autoComplete="name"
                        maxLength={100}
                        required
                    />

                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Ingresá tu correo"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                    />

                    <label htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Mínimo 8 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        minLength={8}
                        required
                    />

                    {error && (
                        <p className="mensaje-error">{error}</p>
                    )}

                    {mensaje && (
                        <p className="mensaje-exito">{mensaje}</p>
                    )}

                    <button type="submit" disabled={cargando}>
                        {cargando ? "Registrando..." : "Crear cuenta"}
                    </button>
                </form>

                <p>
                    ¿Ya tenés una cuenta?{" "}
                    <Link to="/">Iniciar sesión</Link>
                </p>
            </section>
        </main>
    );
}

export default Registro;
