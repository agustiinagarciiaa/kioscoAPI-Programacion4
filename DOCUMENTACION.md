# TuKiosco — Documentación breve

Sistema web para gestionar el inventario de un kiosco: productos, categorías, control de stock y reportes. Cada usuario tiene su cuenta y solo ve y administra sus propios datos.

## Tecnologías

| Capa | Tecnologías |
|---|---|
| Frontend | React 19, React Router 7, Vite, CSS |
| Backend | Node.js, Express 5, JWT, bcryptjs, CORS, dotenv |
| Base de datos | MySQL 8 (`mysql2`, con pool de conexiones) |

## Cómo funciona

```text
Navegador (React)  ──fetch + Bearer token──►  API Express (/api)  ──SQL──►  MySQL
   localStorage: token                        routes → controllers → models
```

1. El usuario se registra o inicia sesión en `/api/auth`. El backend valida los datos, compara la contraseña con bcrypt y devuelve un **token JWT válido por 8 horas**.
2. El frontend guarda el token en `localStorage` y lo envía en cada pedido (`Authorization: Bearer <token>`) desde `src/services/api.js`.
3. El middleware `authMiddleware.js` verifica el token y deja el id del usuario en `req.usuario`. Todas las consultas se filtran por ese usuario.
4. Si la API responde 401 (token vencido), el frontend cierra la sesión y vuelve al login.

## Backend (`backend/`)

Arquitectura por capas:

- `server.js` — punto de entrada; registra rutas, 404 y manejo de errores (siempre responde JSON).
- `routes/` — define los endpoints.
- `controllers/` — valida los datos y arma las respuestas.
- `models/` — consultas SQL.
- `middleware/authMiddleware.js` — protege las rutas con JWT.
- `config/database.js` — pool de conexiones a MySQL.

### Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/registro` | Crear usuario |
| POST | `/api/auth/login` | Iniciar sesión (devuelve token) |
| GET / POST | `/api/categorias` | Listar / crear categorías |
| GET / PUT / DELETE | `/api/categorias/:id` | Ver / modificar / eliminar categoría (solo si no tiene productos) |
| GET / POST | `/api/productos` | Listar / crear productos |
| GET | `/api/productos/stock-bajo` | Productos con `stock <= stock_minimo` |
| GET / PUT / DELETE | `/api/productos/:id` | Ver / modificar / eliminar producto |

Las rutas de categorías y productos requieren token. Códigos: 200, 201, 400 (datos inválidos), 401 (sin sesión), 404 (no existe o es de otro usuario), 409 (duplicado o categoría con productos), 500.

## Frontend (`frontend/src/`)

| Ruta | Página | Acceso |
|---|---|---|
| `/` | Login | Pública |
| `/registro` | Registro | Pública |
| `/dashboard` | Panel principal | Privada |
| `/productos` | ABM de productos con buscador | Privada |
| `/categorias` | ABM de categorías | Privada |
| `/stock-bajo` | Alertas de stock bajo | Privada |
| `/reportes` | Reportes | Privada |

- `context/AuthContext.jsx` — maneja la sesión (usuario y token).
- `hooks/useFetch.js`, `hooks/useProductos.js` — carga de datos reutilizable.
- `LayoutPrivado.jsx` — menú lateral de las páginas privadas.
- `components/VentanaConfirmacion.jsx` — confirmación antes de eliminar.

## Base de datos (`backend/database/`)

Base `inventario_kiosco` con tres tablas:

- **usuarios** — nombre, email (único), `password_hash`.
- **categorias** — nombre único por usuario.
- **productos** — precio (> 0), stock y stock mínimo (≥ 0, por defecto 5).

Reglas: un usuario tiene muchas categorías y productos; borrar un usuario borra sus datos (`CASCADE`); una categoría con productos no se puede borrar (`RESTRICT`); la clave foránea compuesta `(id_categoria, id_usuario)` impide usar la categoría de otro usuario.

Scripts: `schema.sql` (crea todo), `datos_ejemplo.sql` (carga categorías y productos de prueba al primer usuario registrado), `consultas.sql` (consultas de prueba), `migracion_restrict.sql` (solo para bases de la versión anterior).

## Puesta en marcha

```bash
# 1. Base de datos
mysql -u root -p < backend/database/schema.sql

# 2. Backend  (crear backend/.env con DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, PORT, JWT_SECRET)
cd backend && npm install && npm start        # o: npm run dev

# 3. Frontend (otra terminal; VITE_API_URL opcional, por defecto http://localhost:3000/api)
cd frontend && npm install && npm run dev      # http://localhost:5173
```

Verificación del frontend: `npm run lint` y `npm run build`.

Para más detalle (variables de entorno, respuestas por endpoint, seguridad), ver `README.md`.
