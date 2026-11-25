
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContextBase";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    // Iniciamos sesión.
    const manejarLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password) {
            setError("Completá todos los campos.");
            return;
        }

        try {
            setCargando(true);
            await login(email.trim(), password);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message || "No se pudo iniciar sesión.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <main className="pagina-auth">
            <section className="tarjeta-auth">
                <h1>Inventario Kiosco</h1>
                <p>Ingresá a tu cuenta para administrar el negocio.</p>

                <h2>Iniciar sesión</h2>

                <form onSubmit={manejarLogin}>
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
                        placeholder="Ingresá tu contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                    />

                    {error && (
                        <p className="mensaje-error">{error}</p>
                    )}

                    <button type="submit" disabled={cargando}>
                        {cargando ? "Ingresando..." : "Ingresar"}
                    </button>
                </form>

                <p>
                    ¿No tenés una cuenta?{" "}
                    <Link to="/registro">Registrate</Link>
                </p>
            </section>
        </main>
    );
}

export default Login;
