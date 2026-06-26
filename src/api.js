import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'https://gestor-activos-backend.onrender.com';

// ── INSTANCIA BASE ────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
});

// Agregar token automaticamente a cada request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── AUTH ──────────────────────────────────────────────
export const login = async (username, password) => {
  const form = new URLSearchParams();
  form.append('username', username);
  form.append('password', password);
  const res = await axios.post(`${BASE_URL}/auth/login`, form.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  localStorage.setItem('token', res.data.access_token);
  localStorage.setItem('username', username);
  localStorage.setItem('rol', res.data.rol);
  return res.data;
};

// ── ACTIVOS ───────────────────────────────────────────
export const getActivos = async () => {
  const res = await api.get('/activos/');
  return res.data;
};

export const crearActivo = async (activo) => {
  const res = await api.post('/activos/', activo);
  return res.data;
};

export const actualizarActivo = async (id, activo) => {
  const res = await api.put(`/activos/${id}`, activo);
  return res.data;
};

export const eliminarActivo = async (id) => {
  const res = await api.delete(`/activos/${id}`);
  return res.data;
};

export const asignarActivo = async (id, persona, descripcion = '') => {
  const res = await api.patch(`/activos/${id}/asignar?persona=${persona}&descripcion=${descripcion}`);
  return res.data;
};

export const desasignarActivo = async (id) => {
  const res = await api.patch(`/activos/${id}/desasignar`);
  return res.data;
};

// ── HISTORIAL ─────────────────────────────────────────
export const getHistorial = async () => {
  const res = await api.get('/activos/historial/todos');
  return res.data;
};

export default api;

// ── MANTENCIONES ─────────────────────────────────────
export const getMantenciones = async () => {
  const res = await api.get('/mantenciones/');
  return res.data;
};

export const getMantencionesActivo = async (activoId) => {
  const res = await api.get(`/mantenciones/activo/${activoId}`);
  return res.data;
};

export const crearMantencion = async (mantencion) => {
  const res = await api.post('/mantenciones/', mantencion);
  return res.data;
};

export const actualizarMantencion = async (id, mantencion) => {
  const res = await api.put(`/mantenciones/${id}`, mantencion);
  return res.data;
};

export const eliminarMantencion = async (id) => {
  const res = await api.delete(`/mantenciones/${id}`);
  return res.data;
};

// USUARIOS
export const getUsuarios = async () => {
  const res = await api.get('/usuarios/');
  return res.data;
};

export const crearUsuario = async (datos) => {
  const res = await api.post('/usuarios/', datos);
  return res.data;
};

export const eliminarUsuario = async (id) => {
  const res = await api.delete(`/usuarios/${id}`);
  return res.data;
};