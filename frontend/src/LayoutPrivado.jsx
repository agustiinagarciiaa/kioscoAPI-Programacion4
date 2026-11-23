
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContextBase";

function LayoutPrivado({ children }) {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    // Cerramos la sesión.
    const cerrarSesion = () => {
        logout();
        navigate("/");
    };

    const inicial = usuario?.nombre?.charAt(0).toUpperCase() || "U";

    return (
        <main className="layout-dashboard">

            {/* MENÚ LATERAL */}
            <aside className="menu-lateral">

                <div className="marca-dashboard">
                    <div className="logo-dashboard">K</div>

                    <div>
                        <h2>KioscoAPI</h2>
                        <span>Gestión de inventario</span>
                    </div>
                </div>

                <div className="menu-separador">
                    MENÚ PRINCIPAL
                </div>

                <nav className="navegacion-dashboard">

                    <Link to="/dashboard" className="enlace-menu">
                        <span className="icono-menu">⌂</span>
                        Inicio
                    </Link>

                    <Link to="/productos" className="enlace-menu">
                        <span className="icono-menu">▦</span>
                        Productos
                    </Link>

                    <Link to="/categorias" className="enlace-menu">
                        <span className="icono-menu">◇</span>
                        Categorías
                    </Link>

                    <Link to="/stock-bajo" className="enlace-menu">
                        <span className="icono-menu">◷</span>
                        Stock bajo
                    </Link>

                    <Link to="/reportes" className="enlace-menu">
                        <span className="icono-menu">▤</span>
                        Reportes
                    </Link>

                </nav>

                <div className="menu-inferior">

                    <div className="usuario-menu">
                        <div className="avatar-usuario">
                            {inicial}
                        </div>

                        <div className="datos-usuario">
                            <strong>{usuario?.nombre || "Usuario"}</strong>
                            <span>Administrador</span>
                        </div>
                    </div>

                    <button
                        className="boton-cerrar-sesion"
                        onClick={cerrarSesion}
                    >
                        <span>↪</span>
                        Cerrar sesión
                    </button>

                </div>

            </aside>

            {/* CONTENIDO DE CADA PÁGINA */}
            <section className="contenido-seccion">
                {children}
            </section>

        </main>
    );
}

export default LayoutPrivado;
