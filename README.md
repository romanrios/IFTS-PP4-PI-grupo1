# Práctica Profesionalizante 4 - Proyecto Integrador Final

<img alt="MichiGestion" src="https://github.com/user-attachments/assets/a792fd79-ed8e-4464-a2d4-c0ff39603035" />

## Comisión 3A - Grupo 1

- Córdoba, Daniel Ignacio

- Giménez, Mariela Belén

- Gómez, Cecilia Daniela

- Lucchelli, Eugenia

- Ríos, Román

---

Instituto de Formación Técnica Superior N° 29

Tecnicatura Superior en Desarrollo de Software

Año 2026

---

## Descripción del proyecto

MichiGestión es una aplicación web Full Stack desarrollada con el stack MERN para la gestión de adopción de gatos.

La plataforma permite que los adoptantes visualicen gatos disponibles, envíen solicitudes de adopción y gestionen sus solicitudes, mientras que los administradores pueden administrar los animales publicados, revisar solicitudes y aprobar o rechazar procesos de adopción.

---

# Tecnologías utilizadas

## Frontend

* React
* React Router DOM
* Context API
* Axios
* Vite
* CSS Modules / CSS tradicional
* Lucide React

## Backend

* Node.js
* Express
* MongoDB
* Mongoose
* JSON Web Tokens (JWT)
* Google OAuth
* Multer
* Cloudinary

## Infraestructura

* MongoDB Atlas
* Render (Backend)
* Vercel (Frontend)
* Cloudinary (almacenamiento de imágenes)

---

# Funcionalidades implementadas

## Autenticación

### Inicio de sesión con Google

La autenticación se realiza mediante Google OAuth.

Al iniciar sesión:

* Se valida el token recibido desde Google.
* Se crea automáticamente el usuario si no existe.
* Se actualizan los datos básicos del perfil.
* Se genera un JWT para autenticar futuras solicitudes.

### Autorización basada en roles

Existen dos tipos de usuarios:

#### Adoptante

Puede:

* Ver gatos publicados.
* Consultar detalles de los gatos.
* Enviar solicitudes de adopción.
* Editar solicitudes pendientes.
* Cancelar solicitudes pendientes.
* Gestionar su perfil.

#### Administrador

Puede:

* Crear gatos.
* Editar gatos.
* Eliminar gatos.
* Gestionar estados de adopción.
* Ver todas las solicitudes.
* Aprobar o rechazar solicitudes.
* Consultar usuarios registrados.

---

# Gestión de gatos

Los gatos poseen la siguiente información:

* Nombre
* Edad aproximada
* Sexo
* Descripción
* Fotografía
* Estado de adopción

Estados disponibles:

```text
No publicado
Publicado
Con solicitudes
Adoptado
```

### Funcionalidades

* Alta de gatos.
* Modificación de datos.
* Eliminación de registros.
* Subida de imágenes.
* Paginación de resultados.
* Control de visibilidad según rol.

---

# Gestión de solicitudes de adopción

Los usuarios autenticados pueden enviar solicitudes para adoptar un gato.

Cada solicitud almacena:

* Usuario solicitante
* Gato seleccionado
* Motivo de adopción
* Teléfono de contacto
* Estado de la solicitud

Estados disponibles:

```text
Pendiente
Aprobada
Rechazada
```

### Reglas de negocio implementadas

* No se pueden enviar solicitudes para gatos adoptados.
* Un usuario no puede enviar más de una solicitud para el mismo gato.
* Solo las solicitudes pendientes pueden editarse.
* Solo las solicitudes pendientes pueden cancelarse.
* Los administradores pueden aprobar o rechazar solicitudes.

---

# Automatización del proceso de adopción

Cuando una solicitud es aprobada:

1. El gato pasa automáticamente al estado `Adoptado`.
2. Todas las demás solicitudes asociadas al mismo gato son rechazadas automáticamente.
3. Los cambios se ejecutan dentro de una transacción de MongoDB para garantizar consistencia de datos.

---

# Gestión de imágenes

Las fotografías de los gatos se almacenan en Cloudinary.

Características:

* Validación de tipo de archivo.
* Límite de tamaño configurado mediante Multer.
* Carga en memoria y envío directo a Cloudinary.
* Almacenamiento de la URL resultante en MongoDB.

---

# Seguridad

## JWT

Las rutas privadas requieren un token JWT válido.

El middleware de autenticación:

* Verifica la firma del token.
* Recupera el usuario asociado.
* Inyecta los datos del usuario en la request.

## Middleware de autorización

Las operaciones administrativas están protegidas mediante un middleware que verifica el rol del usuario.

---

# Validaciones

La aplicación implementa validaciones tanto en frontend como en backend.

### Backend

Mediante Mongoose:

* Campos obligatorios.
* Longitudes mínimas y máximas.
* Enumeraciones.
* Restricciones de formato.

### Frontend

* Límites de caracteres.
* Validaciones previas al envío.
* Mensajes de error amigables para el usuario.

---

# Experiencia de usuario

Se implementaron componentes de carga para mejorar la percepción de rendimiento:

* Skeleton Cards
* Skeleton Details
* Skeleton Forms
* Loading Spinners

Además:

* Confirmaciones antes de operaciones destructivas.
* Feedback visual de éxito y error.
* Navegación protegida mediante rutas privadas.

---

# Estructura del proyecto

```text
backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
└── server.js

frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── styles/
│   ├── utils/
│   └── api.js
```

---

# Variables de entorno

## Backend

```env
MONGO_URI=
PORT=
GOOGLE_CLIENT_ID=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Frontend

Configurar las variables necesarias para la URL del backend y autenticación según el entorno de despliegue.

---

# Instalación local

## Clonar repositorio

```bash
git clone <repository-url>
cd proyecto
```

## Backend

```bash
cd backend
npm install
npm run dev
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# Arquitectura

El backend sigue una arquitectura basada en capas:

* Routes
* Controllers
* Models
* Middleware
* Config

La persistencia se gestiona mediante MongoDB y Mongoose, mientras que React se encarga de la interfaz de usuario consumiendo una API REST desarrollada con Express.

---

# Objetivos académicos

Este proyecto fue desarrollado con el objetivo de aplicar conceptos de:

* Desarrollo Full Stack
* APIs REST
* Autenticación y autorización
* Persistencia de datos con MongoDB
* Modelado de entidades y relaciones
* Gestión de estados de negocio
* Integración de servicios externos
* Seguridad básica en aplicaciones web
* Arquitectura cliente-servidor

