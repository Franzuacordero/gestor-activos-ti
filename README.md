#  Gestor de Activos TI — SoporteTech Ltda.

Sistema web para la gestión integral de activos tecnológicos, desarrollado como proyecto final del curso TPY1101 Taller Aplicado de Programación — DUOC UC 2026.

---

##  Demo en Producción

| Servicio | URL |
|----------|-----|
| Frontend | https://gestor-activos-frontend.onrender.com |
| Backend API | https://gestor-activos-backend.onrender.com |
| Documentación API | https://gestor-activos-backend.onrender.com/docs |

**Credenciales de prueba:**
- Administrador: `admin` / `admin123`
- Técnico: `tecnico1` / `tecnico123`

>  El servidor usa el plan gratuito de Render. La primera carga puede tardar 30-50 segundos mientras el servidor despierta.

---

##  Descripción del Proyecto

SoporteTech Ltda. gestionaba sus activos tecnológicos en planillas Excel desactualizadas sin trazabilidad ni reportes. Este sistema resuelve el problema centralizando la información en una plataforma web accesible desde cualquier navegador.

### Módulos del Sistema
-  **Autenticación**: Login con JWT, roles admin/técnico
-  **Activos**: CRUD completo con filtros, búsqueda y paginación
-  **Asignación**: Asignar/desasignar equipos con historial automático
-  **Mantenciones**: Registro preventivo/correctivo con seguimiento de estado
-  **Reportería**: Dashboard con estadísticas y exportación PDF/CSV
-  **Usuarios**: Gestión de usuarios desde la app (solo admin)
-  **Detalle de Activo**: Historial completo por activo con foto
-  **Notificaciones**: Alertas de activos en reparación por más de 7 días
-  **Foto de Activo**: Subida de imágenes via Cloudinary
-  **Cambiar Contraseña**: Desde el sidebar sin cerrar sesión

---

##  Stack Tecnológico

| Componente | Tecnología |
|-----------|-----------|
| Frontend | React.js 18 |
| Backend | Python 3 + FastAPI |
| Base de datos | PostgreSQL (Render) |
| Autenticación | JWT + bcrypt |
| Despliegue | Render (PaaS) |
| Exportación | jsPDF + jspdf-autotable |
| Almacenamiento | Cloudinary (imágenes) |

---

##  Arquitectura

```
Usuario (Navegador)
    ↓ HTTPS
Frontend React.js (Render Static Site)
    ↓ REST API / JSON
Backend FastAPI (Render Web Service)
    ↓ SQLAlchemy ORM
Base de datos PostgreSQL (Render)
```

Patrón de diseño: **MVC**
- **Modelo**: `backend/models/models.py` (SQLAlchemy)
- **Vista**: `src/components/` (React.js)
- **Controlador**: `backend/router/` (FastAPI)

---

## Estructura del Proyecto

```
gestor-activos/
├── backend/
│   ├── main.py              ← punto de entrada + seed automático
│   ├── database.py          ← conexión PostgreSQL
│   ├── schemas.py           ← validación de datos (Pydantic)
│   ├── auth.py              ← lógica JWT + bcrypt
│   ├── seed.py              ← script para poblar BD
│   ├── requirements.txt     ← dependencias Python
│   ├── models/
│   │   └── models.py        ← tablas: Usuario, Activo, Historial, Mantencion
│   └── router/
│       ├── activos.py       ← endpoints CRUD activos
│       ├── auth.py          ← endpoints login/registro
│       └── mantenciones.py  ← endpoints mantenciones
├── src/
│   ├── App.js               ← componente principal + navegación
│   ├── api.js               ← llamadas axios al backend
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Activos.jsx
│   │   ├── Asignacion.jsx
│   │   ├── Mantenciones.jsx
│   │   └── Reporteria.jsx
│   │   ├── Usuarios.jsx
│   │   ├── DetalleActivo.jsx
│   │   └── Notificaciones.jsx
│   └── styles/
│       └── styles.js        ← estilos globales
├── package.json
└── README.md
```

---

##  Cómo Correr Localmente

### Requisitos
- Python 3.11+
- Node.js 18+
- Git

### Backend

```PowerShell
# Clonar el repositorio
git clone https://github.com/Franzuacordero/gestor-activos-ti.git
cd gestor-activos-ti/backend

# Instalar dependencias
pip install -r requirements.txt

# Iniciar el servidor
python -m uvicorn main:app --reload
# → http://localhost:8000
# → Documentación: http://localhost:8000/docs
```

### Frontend

```PowerShell
# En otra terminal, desde la raíz del proyecto
npm install
npm start
# → http://localhost:3000
```

### Poblar la base de datos (opcional)

```bash
cd backend
python seed.py
```

---

##  Modelo de Base de Datos

```
USUARIOS          ACTIVOS           HISTORIAL         MANTENCIONES
─────────         ────────          ──────────        ────────────
id (PK)           id (PK)           id (PK)           id (PK)
username          nombre            activo_id (FK)    activo_id (FK)
password          tipo              tipo              tipo
rol               marca             descripcion       descripcion
                  modelo            fecha             tecnico
                  serie (único)     tecnico           estado
                  estado                              fecha
                  asignado_a                          fecha_fin
                  fecha
                  foto_url
```

---

##  Seguridad

- **bcrypt**: hashing unidireccional de contraseñas
- **JWT**: autenticación stateless con expiración de 60 minutos
- **Roles**: administrador y técnico con permisos diferenciados
- **HTTPS**: comunicación cifrada en producción
- **CORS**: solo orígenes autorizados pueden conectarse al backend

---

##  Plan de Pruebas

Se ejecutaron 15 casos de prueba con 100% de éxito:

| Categoría | Casos | Resultado |
|-----------|-------|-----------|
| Autenticación | CP-01 al CP-03 |  EXITOSO |
| Gestión de Activos | CP-04 al CP-07 |  EXITOSO |
| Asignación | CP-08 al CP-09 |  EXITOSO |
| Mantenciones | CP-10 al CP-11 |  EXITOSO |
| Reportería | CP-12 al CP-14 |  EXITOSO |
| Seguridad | CP-15 |  EXITOSO |

---

##  Equipo

| Nombre | Rol |
|--------|-----|
| Emmanuel Cordero Rojas | Desarrollador Full Stack |

**Institución:** DUOC UC  
**Curso:** TPY1101 Taller Aplicado de Programación  
**Sección:** 003V  
**Docente:** Cristian Carreño  
**Año:** 2026
