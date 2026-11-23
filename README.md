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
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── categoriaController.js
│   │   └── productoController.js
│   ├── database/
│   │   └── schema.sql
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── categoriaModel.js
│   │   ├── productoModel.js
│   │   └── usuarioModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoriaRoutes.js
│   │   └── productoRoutes.js
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── .gitignore
└── README.md
```

## Requisitos previos

Para ejecutar el proyecto se necesita:

- Node.js.
- MySQL.
- Un gestor de base de datos, como DBeaver.
- Visual Studio Code.

## Instalación

### 1. Obtener el proyecto

Clonar o descargar el repositorio y abrir una terminal en la carpeta principal.

### 2. Configurar el backend

```bash
cd backend
npm install
```

Crear un archivo `.env` dentro de la carpeta `backend` con las siguientes variables:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=inventario_kiosco
DB_PORT=3306
JWT_SECRET=colocar_una_clave_secreta
```

Completar los valores según la configuración local de MySQL.

### 3. Configurar la base de datos

Abrir MySQL o DBeaver e importar el archivo:

`backend/database/schema.sql`

Este archivo contiene la estructura de la base de datos necesaria para trabajar con el sistema.

### 4. Ejecutar el backend

Desde la carpeta `backend`:

```bash
node server.js
```

El servidor estará disponible en:

`http://localhost:3000`

### 5. Configurar el frontend

Abrir una segunda terminal y ejecutar:

```bash
cd frontend
npm install
```

### 6. Ejecutar el frontend

```bash
npm run dev
```

Vite mostrará la dirección local para abrir la aplicación en el navegador.

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

## Seguridad

- Contraseñas protegidas mediante bcryptjs.
- Autenticación con JWT.
- Rutas protegidas mediante middleware.
- Validación de datos recibidos.
- Consultas de productos y categorías filtradas por usuario.
- Variables de configuración almacenadas en `.env`.


## Comprobaciones del proyecto

Para verificar el frontend:

```bash
cd frontend
npm run lint
npm run build
```

Para iniciar el backend:

```bash
cd backend
npm start
```

El backend debe mostrar un mensaje de inicio del servidor y confirmar la conexión con MySQL.

## Ejecución de producción

Para generar la versión de producción del frontend:

```bash
cd frontend
npm run build
```

Los archivos compilados se generan en la carpeta `dist`.

## Autoría

Proyecto académico desarrollado para aplicar conocimientos de programación web, bases de datos, API REST y desarrollo frontend.