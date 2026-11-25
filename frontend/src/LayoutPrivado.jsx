
import { NavLink, useNavigate } from "react-router-dom";
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

    // NavLink nos dice si el enlace corresponde a la página actual
    // (isActive) y así resaltamos la sección en la que estamos.
    const claseEnlace = ({ isActive }) =>
        isActive ? "enlace-menu activo" : "enlace-menu";

    return (
        <main className="layout-dashboard">

            {/* MENÚ LATERAL */}
            <aside className="menu-lateral">

                <div className="marca-dashboard">
                    <img className="logo-dashboard" src="/favicon.svg" alt="Logo TuKiosco" />

                    <div>
                        <h2>TuKiosco</h2>
                        <span>Gestión de inventario</span>
                    </div>
                </div>

                <div className="menu-separador">
                    MENÚ PRINCIPAL
                </div>

                <nav className="navegacion-dashboard">

                    <NavLink to="/dashboard" className={claseEnlace}>
                        <span className="icono-menu">🏪</span>
                        Inicio
                    </NavLink>

                    <NavLink to="/productos" className={claseEnlace}>
                        <span className="icono-menu">🍫</span>
                        Productos
                    </NavLink>

                    <NavLink to="/categorias" className={claseEnlace}>
                        <span className="icono-menu">🏷️</span>
                        Categorías
                    </NavLink>

                    <NavLink to="/stock-bajo" className={claseEnlace}>
                        <span className="icono-menu">📦</span>
                        Stock bajo
                    </NavLink>

                    <NavLink to="/reportes" className={claseEnlace}>
                        <span className="icono-menu">🧾</span>
                        Reportes
                    </NavLink>

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
                        type="button"
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
