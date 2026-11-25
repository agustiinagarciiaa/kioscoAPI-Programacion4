# Sistema de Gestión de Inventario para Kiosco

## Descripción del proyecto

Sistema web para administrar el inventario de un kiosco. Permite gestionar productos, categorías, usuarios y controlar el stock disponible.

El sistema cuenta con autenticación de usuarios y permite que cada usuario administre sus propios productos y categorías.

## Tecnologías utilizadas

### Frontend
- React
- JavaScript
- React Router DOM
- Vite
- CSS

### Backend
- Node.js
- Express
- MySQL
- JWT (JSON Web Token)
- bcryptjs

## Funcionalidades principales

- Registro de usuarios.
- Inicio y cierre de sesión.
- Autenticación mediante JWT.
- Gestión de productos.
- Alta, consulta, modificación y eliminación de productos.
- Gestión de categorías.
- Control de stock.
- Alertas de productos con stock bajo.
- Panel principal.
- Reportes.
- Protección de rutas.
- Validación de formularios.
- Separación de información por usuario.

## Estructura del proyecto

```text
kioscoAPI/
│
├── backend/
│   ├── config/
│   │   └── database.js            # Pool de conexiones a MySQL
│   ├── controllers/
│   │   ├── authController.js      # Registro e inicio de sesión
│   │   ├── categoriaController.js
│   │   └── productoController.js
│   ├── database/
│   │   ├── schema.sql             # Crea la base y las tablas
│   │   ├── consultas.sql          # Consultas de prueba (opcional)
│   │   └── migracion_restrict.sql # Solo para bases creadas con la versión vieja
│   ├── middleware/
│   │   └── authMiddleware.js      # Verifica el token JWT
│   ├── models/
│   │   ├── categoriaModel.js
│   │   ├── productoModel.js
│   │   └── usuarioModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoriaRoutes.js
│   │   └── productoRoutes.js
│   ├── .env.example               # Modelo de variables de entorno
│   ├── package.json
│   └── server.js                  # Punto de entrada de la API
│
├── frontend/
│   ├── src/
│   │   ├── context/               # AuthContext (sesión)
│   │   ├── hooks/                 # useFetch y useProductos (hooks propios)
│   │   ├── pages/                 # Una página por ruta
│   │   ├── services/              # api.js (comunicación con el backend)
│   │   ├── App.jsx                # Rutas y protección de rutas
│   │   ├── LayoutPrivado.jsx      # Menú lateral de las páginas privadas
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

## Requisitos previos

- [Node.js](https://nodejs.org) versión 20 o superior (recomendado: la versión LTS).
- MySQL 8 (o MariaDB / XAMPP).
- Un gestor de base de datos, como DBeaver o MySQL Workbench (opcional: también se puede usar la consola).
- Visual Studio Code (opcional).

## Variables de entorno

### Backend (`backend/.env`)

Copiar `backend/.env.example` como `backend/.env` y completar:

| Variable | Para qué sirve | Ejemplo |
|---|---|---|
| `DB_HOST` | Dirección del servidor MySQL | `localhost` |
| `DB_USER` | Usuario de MySQL | `root` |
| `DB_PASSWORD` | Contraseña de ese usuario (vacía en XAMPP) | `mi_clave` |
| `DB_NAME` | Nombre de la base | `inventario_kiosco` |
| `DB_PORT` | Puerto de MySQL | `3306` |
| `PORT` | Puerto donde corre la API | `3000` |
| `JWT_SECRET` | Clave para firmar los tokens. Larga y secreta | `una_clave_larga_123` |

### Frontend (`frontend/.env`, opcional)

| Variable | Para qué sirve | Valor por defecto |
|---|---|---|
| `VITE_API_URL` | Dirección de la API | `http://localhost:3000/api` |

> El archivo `.env` **no se sube al repositorio** (está en `.gitignore`). Solo se sube `.env.example`.

## Instalación

### 1. Obtener el proyecto

Clonar o descargar el repositorio y abrir una terminal en la carpeta principal `kioscoAPI`.

### 2. Crear la base de datos

Con MySQL encendido, importar `backend/database/schema.sql`:

- **DBeaver / Workbench:** abrir el archivo y ejecutarlo completo (en DBeaver: *Ejecutar script*, `Alt + X`).
- **Consola:**

```bash
mysql -u root -p < backend/database/schema.sql
```

El script crea la base `inventario_kiosco` con las tablas `usuarios`, `categorias` y `productos`.

> **¿Ya tenían la base creada con la versión anterior?** Ejecuten `backend/database/migracion_restrict.sql`. Cambia la regla de borrado de categorías sin perder los datos.

### 3. Configurar y ejecutar el backend

```bash
cd backend
npm install
```

Crear `backend/.env` a partir de `.env.example` (en Windows: `copy .env.example .env`; en Linux/Mac: `cp .env.example .env`) y completar los datos. Después:

```bash
npm start
```

Tiene que aparecer:

```text
Servidor funcionando en http://localhost:3000
Conexión a MySQL establecida correctamente
```

> Para desarrollo: `npm run dev` reinicia el servidor solo cada vez que se guarda un archivo.

### 4. Configurar y ejecutar el frontend

En **otra terminal** (el backend tiene que seguir encendido):

```bash
cd frontend
npm install
npm run dev
```

Abrir la dirección que muestra Vite (normalmente `http://localhost:5173`).

## Endpoints de la API

Todas las rutas de categorías y productos requieren el encabezado `Authorization: Bearer <token>`.

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| POST | `/api/auth/registro` | Crea un usuario | 201, 400, 409 |
| POST | `/api/auth/login` | Inicia sesión y devuelve el token | 200, 400, 401 |
| GET | `/api/categorias` | Lista las categorías del usuario | 200, 401 |
| GET | `/api/categorias/:id` | Obtiene una categoría | 200, 400, 404 |
| POST | `/api/categorias` | Crea una categoría | 201, 400, 409 |
| PUT | `/api/categorias/:id` | Modifica una categoría | 200, 400, 404, 409 |
| DELETE | `/api/categorias/:id` | Elimina una categoría (solo si no tiene productos) | 200, 404, 409 |
| GET | `/api/productos` | Lista los productos del usuario | 200, 401 |
| GET | `/api/productos/stock-bajo` | Productos con stock ≤ stock mínimo | 200, 401 |
| GET | `/api/productos/:id` | Obtiene un producto | 200, 400, 404 |
| POST | `/api/productos` | Crea un producto | 201, 400 |
| PUT | `/api/productos/:id` | Modifica un producto | 200, 400, 404 |
| DELETE | `/api/productos/:id` | Elimina un producto | 200, 400, 404 |

**Códigos usados:** 200 OK · 201 creado · 400 datos inválidos · 401 sin sesión o token vencido · 404 no existe (o no es del usuario) · 409 conflicto (duplicado o categoría con productos) · 500 error del servidor.

## Arquitectura del backend

El backend utiliza una arquitectura por capas:

- **Routes:** definen los endpoints de la API.
- **Controllers:** reciben las solicitudes, validan los datos y gestionan las respuestas.
- **Models:** realizan las consultas a la base de datos.
- **Middleware:** verifica la autenticación mediante JWT.
- **Config:** contiene la configuración de conexión a MySQL.

## Base de datos

La base de datos utilizada se llama `inventario_kiosco`.

Contiene las siguientes tablas principales:

- `usuarios`: almacena los datos de las cuentas.
- `categorias`: almacena las categorías de productos.
- `productos`: almacena los productos y sus datos de inventario.

Las tablas de productos y categorías se relacionan con los usuarios para mantener separados sus registros.

- Un usuario tiene muchas categorías y muchos productos (1 a N).
- Una categoría tiene muchos productos (1 a N).
- Una categoría **no se puede eliminar si tiene productos** (`ON DELETE RESTRICT`).
- La clave foránea compuesta `(id_categoria, id_usuario)` impide asignar a un producto la categoría de otro usuario.

## Seguridad

- Contraseñas protegidas mediante bcryptjs.
- Autenticación con JWT.
- Rutas protegidas mediante middleware.
- Validación de datos recibidos.
- Consultas de productos y categorías filtradas por usuario.
- Variables de configuración almacenadas en `.env`.
- Si el token vence, el frontend cierra la sesión y vuelve al login.


## Comprobaciones del proyecto

```bash
cd frontend
npm run lint    # revisa el código
npm run build   # genera la versión de producción en frontend/dist
```

## Autoría

Proyecto académico desarrollado para aplicar conocimientos de programación web, bases de datos, API REST y desarrollo frontend.