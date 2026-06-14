# MichiGestión

<img alt="MichiGestión" src="https://github.com/user-attachments/assets/a792fd79-ed8e-4464-a2d4-c0ff39603035" />

Sistema web para la gestión de adopciones de gatos.

Desarrollado como Proyecto Integrador de Práctica Profesionalizante IV de la Tecnicatura Superior en Desarrollo de Software del Instituto de Formación Técnica Superior N° 29.

**Comisión 3A · Grupo 1**
- Daniel Ignacio Córdoba
- Mariela Belén Giménez
- Cecilia Daniela Gómez
- Eugenia Lucchelli
- Román Ríos

---

MichiGestión permite administrar el catálogo de gatos disponibles para adopción, gestionar solicitudes de adoptantes y automatizar el flujo de aprobación mediante reglas de negocio integradas.

---


## Características principales

### Para adoptantes

- Iniciar sesión mediante Google.
- Visualizar gatos disponibles.
- Consultar información detallada de cada gato.
- Enviar solicitudes de adopción.
- Editar o cancelar solicitudes pendientes.
- Gestionar información de perfil.

### Para administradores

- Crear, editar y eliminar registros de gatos.
- Publicar o despublicar gatos.
- Gestionar estados de adopción.
- Revisar todas las solicitudes recibidas.
- Aprobar o rechazar solicitudes.
- Buscar, filtrar y ordenar información desde los paneles administrativos.

---

## Tecnologías utilizadas

### Frontend

- React
- React Router
- Context API
- Axios
- Vite
- Lucide React

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Google OAuth
- Multer
- Cloudinary

### Infraestructura

- MongoDB Atlas
- Render
- Vercel
- Cloudinary

---

## Reglas de negocio

### Gestión de solicitudes

- Un usuario puede enviar una única solicitud por gato.
- No se permiten solicitudes para gatos ya adoptados.
- Solo las solicitudes pendientes pueden modificarse o cancelarse.
- Los administradores pueden aprobar o rechazar solicitudes.

### Automatización del proceso de adopción

Cuando una solicitud es aprobada:

- El gato pasa automáticamente a estado **Adoptado**.
- Todas las demás solicitudes asociadas son rechazadas.
- La operación se ejecuta mediante transacciones de MongoDB para garantizar consistencia.

Cuando una solicitud pendiente es cancelada, rechazada o eliminada:

- El sistema recalcula automáticamente el estado del gato.
- Si no quedan solicitudes pendientes, vuelve a estado **Publicado**.
- Si aún existen solicitudes, permanece en estado **Con solicitudes**.

---

## Instalación local

### 1. Clonar el repositorio

```bash
git clone https://github.com/romanrios/IFTS-PP4-PI-grupo1.git
cd IFTS-PP4-PI-grupo1
```

### 2. Configurar variables de entorno

#### Backend

```env
MONGO_URI=
PORT=
GOOGLE_CLIENT_ID=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

#### Frontend

```env
VITE_API_URL=
VITE_GOOGLE_CLIENT_ID=
```

### 3. Ejecutar el backend

```bash
cd backend
npm install
npm run dev
```

### 4. Ejecutar el frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Estructura del proyecto

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

## Seguridad

### Autenticación

- Inicio de sesión mediante Google OAuth.
- Generación de JWT para sesiones autenticadas.
- Protección de rutas privadas mediante middleware.

### Autorización

- Control de acceso basado en roles.
- Operaciones administrativas restringidas a usuarios autorizados.

---

## Experiencia de usuario

- Skeleton loaders para listas, formularios y detalles.
- Indicadores de carga.
- Confirmaciones para acciones destructivas.
- Mensajes de éxito y error.
- Navegación protegida.
- Scroll automático entre páginas.

---

**Tecnicatura Superior en Desarrollo de Software**

Instituto de Formación Técnica Superior N.º 29  

Práctica Profesionalizante 4 · Proyecto Integrador

Año 2026