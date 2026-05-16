# Gestor de Activos TI — SoporteTech Ltda.
## TPY1101 — Estado de Avance N°1

---

## Estructura del proyecto

```
src/
  components/
    Dashboard.jsx    ← resumen general
    Activos.jsx      ← registro y edicion de activos
    Asignacion.jsx   ← asignacion y seguimiento
    Reporteria.jsx   ← reportes y exportacion CSV
  data/
    datosIniciales.js ← datos de prueba
  styles/
    styles.js         ← estilos globales
  App.js             ← componente principal
  index.js           ← punto de entrada
```

---

## Cómo correr en Windows con VS Code

1. Abre la carpeta en VS Code
2. Abre la terminal integrada (Ctrl + Ñ)
3. Ejecuta:
```
npm install
npm start
```
4. Se abre en http://localhost:3000

---

## Stack tecnológico
- Frontend: React.js 18
- Estilos: CSS-in-JS
- Datos: En memoria (sin backend por ahora)

## Próximas versiones
- Backend: Python + FastAPI
- Base de datos: PostgreSQL
- Despliegue: Render (PaaS)
- Autenticación: JWT
