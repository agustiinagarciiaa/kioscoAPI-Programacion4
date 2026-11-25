
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContextBase";

import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Dashboard from "./pages/Dashboard";
import Productos from "./pages/Productos";
import Categorias from "./pages/Categorias";
import StockBajo from "./pages/StockBajo";
import Reportes from "./pages/Reportes";

import LayoutPrivado from "./LayoutPrivado";

import "./App.css";

// Protegemos las páginas privadas:
// si no hay sesión, mandamos al usuario al login.
function RutaPrivada({ children }) {
    const { usuario } = useAuth();

    if (!usuario) {
        return <Navigate to="/" replace />;
    }

    return children;
}

// Administramos las rutas.
function ContenidoApp() {
    const { usuario } = useAuth();

    return (
        <Routes>

            <Route
                path="/"
                element={
                    usuario
                        ? <Navigate to="/dashboard" replace />
                        : <Login />
                }
            />

            <Route
                path="/registro"
                element={
                    usuario
                        ? <Navigate to="/dashboard" replace />
                        : <Registro />
                }
            />

            <Route
                path="/dashboard"
                element={
                    <RutaPrivada>
                        <LayoutPrivado>
                            <Dashboard />
                        </LayoutPrivado>
                    </RutaPrivada>
                }
            />

            <Route
                path="/productos"
                element={
                    <RutaPrivada>
                        <LayoutPrivado>
                            <Productos />
                        </LayoutPrivado>
                    </RutaPrivada>
                }
            />

            <Route
                path="/categorias"
                element={
                    <RutaPrivada>
                        <LayoutPrivado>
                            <Categorias />
                        </LayoutPrivado>
                    </RutaPrivada>
                }
            />

            <Route
                path="/stock-bajo"
                element={
                    <RutaPrivada>
                        <LayoutPrivado>
                            <StockBajo />
                        </LayoutPrivado>
                    </RutaPrivada>
                }
            />

            <Route
                path="/reportes"
                element={
                    <RutaPrivada>
                        <LayoutPrivado>
                            <Reportes />
                        </LayoutPrivado>
                    </RutaPrivada>
                }
            />

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />

        </Routes>
    );
}

// Componente principal.
function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ContenidoApp />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
