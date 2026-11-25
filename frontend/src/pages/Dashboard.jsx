
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContextBase";

// Página de inicio. El menú lateral lo pone LayoutPrivado
// (igual que en las demás páginas privadas).
function Dashboard() {
    const { usuario } = useAuth();

    return (
        <section className="contenido-dashboard">

            <header className="barra-superior">
                <div>
                    <span className="subtitulo-dashboard">
                        PANEL DE CONTROL
                    </span>

                    <h1>Inicio</h1>
                </div>

                <div className="etiqueta-sistema">
                    <span className="punto-sistema"></span>
                    Sistema activo
                </div>
            </header>

            {/* BIENVENIDA */}
            <section className="bienvenida-panel">

                <div>
                    <span className="etiqueta-bienvenida">
                        TU ESPACIO DE GESTIÓN
                    </span>

                    <h2>
                        ¡Hola, {usuario?.nombre || "usuario"}!
                    </h2>

                    <p>
                        Bienvenido/a a TuKiosco. Desde acá podés
                        administrar y controlar el inventario de tu kiosco.
                    </p>
                </div>

                <div className="ilustracion-bienvenida">
                    <span>🏪</span>
                </div>

            </section>

            {/* ACCESOS PRINCIPALES */}
            <section className="seccion-accesos">

                <div className="titulo-seccion-dashboard">
                    <div>
                        <h2>Administración</h2>
                        <p>Seleccioná qué sección querés gestionar.</p>
                    </div>
                </div>

                <div className="tarjetas-dashboard">

                    <article className="tarjeta-dashboard tarjeta-productos">
                        <div className="icono-tarjeta icono-azul">
                            🍫
                        </div>

                        <span className="categoria-tarjeta">
                            INVENTARIO
                        </span>

                        <h3>Productos</h3>

                        <p>
                            Agregá, modificá y consultá los productos
                            disponibles en tu kiosco.
                        </p>

                        <Link to="/productos">
                            Administrar productos <span>→</span>
                        </Link>
                    </article>

                    <article className="tarjeta-dashboard tarjeta-categorias">
                        <div className="icono-tarjeta icono-lavanda">
                            🏷️
                        </div>

                        <span className="categoria-tarjeta">
                            ORGANIZACIÓN
                        </span>

                        <h3>Categorías</h3>

                        <p>
                            Organizá tus productos en diferentes
                            categorías para mantener el orden.
                        </p>

                        <Link to="/categorias">
                            Ver categorías <span>→</span>
                        </Link>
                    </article>

                    <article className="tarjeta-dashboard tarjeta-stock">
                        <div className="icono-tarjeta icono-naranja">
                            📦
                        </div>

                        <span className="categoria-tarjeta">
                            CONTROL
                        </span>

                        <h3>Stock bajo</h3>

                        <p>
                            Revisá los productos que necesitan
                            reposición en tu inventario.
                        </p>

                        <Link to="/stock-bajo">
                            Revisar inventario <span>→</span>
                        </Link>
                    </article>

                    <article className="tarjeta-dashboard tarjeta-reportes">
                        <div className="icono-tarjeta icono-verde">
                            🧾
                        </div>

                        <span className="categoria-tarjeta">
                            INFORMACIÓN
                        </span>

                        <h3>Reportes</h3>

                        <p>
                            Consultá los datos generales y el valor
                            de los productos de tu inventario.
                        </p>

                        <Link to="/reportes">
                            Consultar reportes <span>→</span>
                        </Link>
                    </article>

                </div>

            </section>

            <footer className="footer-dashboard">
                TuKiosco · Sistema de gestión de inventario
            </footer>

        </section>
    );
}

export default Dashboard;
