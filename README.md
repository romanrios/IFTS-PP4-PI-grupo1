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

MichiGestión es una aplicación MERN para gestión de adopción de gatos. Permite a adoptantes visualizar animales disponibles y enviar solicitudes de adopción, y a administradores gestionar catálogos, revisar solicitudes y automatizar procesos de aprobación.

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

### Google OAuth

* Validación de token desde Google
* Creación automática de usuario si no existe
* Actualización de datos del perfil
* Generación de JWT para autenticación subsecuente

### Autorización basada en roles

Existen dos tipos de usuarios:

#### Adoptante

* Ver gatos publicados
* Consultar detalles de animales
* Enviar solicitudes de adopción
* Editar solicitudes pendientes
* Cancelar solicitudes propias
* Gestionar perfil

#### Administrador

* CRUD de gatos
* Gestionar estados de adopción
* Ver y gestionar todas las solicitudes
* Acceso a herramientas avanzadas: búsqueda, filtrado y ordenamiento en Paneles

---

# Gestión de gatos

## Atributos

* Nombre, edad aproximada, sexo, descripción, fotografía
* Estados: No publicado | Publicado | Con solicitudes | Adoptado

## Funcionalidades

* CRUD de registros
* Subida de imágenes a Cloudinary
* Paginación de resultados
* Control de visibilidad por rol
* Búsqueda por nombre (insensible a mayúsculas)
* Filtrado por estado de adopción
* Ordenamiento cronológico (recientes / antiguos)

---

# Gestión de solicitudes de adopción

## Atributos

* Usuario solicitante, gato seleccionado, motivo, teléfono de contacto
* Estados: Pendiente | Aprobada | Rechazada

## Herramientas de administración

* Búsqueda de texto cruzado: coincidencias en nombre de gato o adoptante
* Filtrado por estado de solicitud
* Ordenamiento por fecha (recientes / antiguos)

## Reglas de negocio

* No solicitudes para gatos adoptados
* Un usuario = máximo una solicitud por gato
* Solo pendientes se editan o cancelan
* Admin aprueba o rechaza solicitudes

---

# Automatización del proceso de adopción

## Sincronización progresiva (aprobación)

Al aprobar solicitud:

* Gato pasa a estado `Adoptado`
* Todas las demás solicitudes del mismo gato se rechazan automáticamente
* Cambios en transacción MongoDB para garantizar consistencia

## Sincronización inversa (cancelación)

Al cancelar/rechazar/eliminar solicitud pendiente:

* Backend recalcula solicitudes pendientes del gato
* Si contador = 0: gato revierte a `Publicado`
* Si persisten pendientes: gato mantiene `Con solicitudes`
* Lógica segura frente a condiciones de carrera

---

# Gestión de imágenes

* Almacenamiento en Cloudinary
* Validación de tipo y tamaño mediante Multer
* Carga en memoria con envío directo
* URL almacenada en MongoDB

---

# Seguridad

## JWT

* Verificación de firma en rutas privadas
* Middleware: recupera usuario e inyecta datos en request

## Autorización

* Middleware de validación de rol para operaciones administrativas

---

# Validaciones

## Backend (Mongoose)

* Campos obligatorios, longitudes mín/máx, enumeraciones, restricciones de formato

## Frontend

* Límites de caracteres, validaciones previas, mensajes amigables

---

# Experiencia de usuario

## Componentes de carga

* Skeleton Cards, Details, Forms
* Loading Spinners

## Mejoras UX

* Confirmaciones antes de operaciones destructivas
* Feedback visual de éxito/error
* Scroll automático al cambiar página (ScrollToTop)
* Respuestas HTTP 200 estructuradas en lugar de errores 404 innecesarios
* Rutas privadas protegidas por autenticación

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

```env
VITE_API_URL=
VITE_GOOGLE_CLIENT_ID=
```

---

# Instalación local

## Clonar repositorio

```bash
git clone https://github.com/romanrios/IFTS-PP4-PI-grupo1/
cd ifts-pp4-pi-grupo1
```

## Backend

```bash
cd backend
npm install
npm run dev
```

## Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

---

# Arquitectura

## Backend

Arquitectura en capas: Routes → Controllers → Models + Middleware + Config

## Stack

* Persistencia: MongoDB + Mongoose
* API REST: Express
* Frontend: React consumiendo API

---

# Objetivos académicos

* Full Stack development
* APIs REST
* Autenticación / autorización basada en roles
* Persistencia MongoDB
* Modelado de entidades y relaciones
* Gestión de estados de negocio
* Integración de servicios externos (Google OAuth, Cloudinary)
* Seguridad en aplicaciones web
* Arquitectura cliente-servidor

