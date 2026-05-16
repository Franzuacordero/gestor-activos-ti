import { useState, useEffect } from 'react';
import { styles } from '../styles/styles';
import { getMantenciones, crearMantencion, actualizarMantencion, eliminarMantencion } from '../api';

const TIPOS = ['Preventiva', 'Correctiva', 'Predictiva'];
const ESTADOS = ['Pendiente', 'En proceso', 'Completada'];

const FORM_INICIAL = {
  activo_id: '',
  tipo: 'Preventiva',
  descripcion: '',
  tecnico: '',
  estado: 'Pendiente',
  fecha: new Date().toISOString().split('T')[0],
  fecha_fin: ''
};

export default function Mantenciones({ activos, rol, cargarDatos }) {
  const [mantenciones, setMantenciones] = useState([]);
  const [modal, setModal]   = useState(false);
  const [form, setForm]     = useState(FORM_INICIAL);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('');

  useEffect(() => { cargarMantenciones(); }, []);

  async function cargarMantenciones() {
    try {
      const data = await getMantenciones();
      setMantenciones(data);
    } catch (err) {
      console.error('Error cargando mantenciones:', err);
    }
  }

  function abrirNuevo() {
    setForm(FORM_INICIAL);
    setEditId(null);
    setModal(true);
  }

  function abrirEditar(m) {
    setForm({
      activo_id: m.activo_id, tipo: m.tipo, descripcion: m.descripcion,
      tecnico: m.tecnico, estado: m.estado, fecha: m.fecha, fecha_fin: m.fecha_fin || ''
    });
    setEditId(m.id);
    setModal(true);
  }

  async function guardar() {
    if (!form.activo_id || !form.descripcion || !form.tecnico) return alert('Completa todos los campos obligatorios.');
    setLoading(true);
    try {
      if (editId) {
        await actualizarMantencion(editId, form);
      } else {
        await crearMantencion({ ...form, activo_id: Number(form.activo_id) });
      }
      await cargarMantenciones();
      await cargarDatos();
      setModal(false);
      setForm(FORM_INICIAL);
      setEditId(null);
    } catch (err) {
      alert(err.response?.data?.detail || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  }

  async function eliminar(id) {
    if (!window.confirm('¿Eliminar esta mantención?')) return;
    try {
      await eliminarMantencion(id);
      await cargarMantenciones();
    } catch (err) {
      alert('Error al eliminar');
    }
  }

  const mantencionsFiltradas = filtroEstado
    ? mantenciones.filter(m => m.estado === filtroEstado)
    : mantenciones;

  const colorEstado = { 'Pendiente': '#ffa726', 'En proceso': '#4fc3f7', 'Completada': '#66bb6a' };

  return (
    <div>
      <div style={styles.pageTitle}>Mantenciones</div>
      <div style={styles.pageSub}>Registra y controla las mantenciones de los activos tecnologicos.</div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total', count: mantenciones.length, color: '#4fc3f7' },
          { label: 'Pendientes', count: mantenciones.filter(m => m.estado === 'Pendiente').length, color: '#ffa726' },
          { label: 'En proceso', count: mantenciones.filter(m => m.estado === 'En proceso').length, color: '#4fc3f7' },
          { label: 'Completadas', count: mantenciones.filter(m => m.estado === 'Completada').length, color: '#66bb6a' },
        ].map((s, i) => (
          <div key={i} style={styles.statCard}>
            <div style={{ ...styles.statNum, color: s.color }}>{s.count}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <select style={{ ...styles.input, width: 200 }} value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          {ESTADOS.map(e => <option key={e}>{e}</option>)}
        </select>
        <button style={styles.btn('primary')} onClick={abrirNuevo}>+ Nueva Mantencion</button>
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>{['Activo', 'Tipo', 'Descripcion', 'Tecnico', 'Estado', 'Fecha', 'Acciones'].map(h => (
              <th key={h} style={styles.th}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {mantencionsFiltradas.map(m => {
              const activo = activos.find(a => a.id === m.activo_id);
              return (
                <tr key={m.id}>
                  <td style={styles.td}>{activo?.nombre || `ID: ${m.activo_id}`}</td>
                  <td style={{ ...styles.td, color: '#888' }}>{m.tipo}</td>
                  <td style={{ ...styles.td, color: '#888', maxWidth: 200 }}>{m.descripcion}</td>
                  <td style={{ ...styles.td, color: '#888' }}>{m.tecnico}</td>
                  <td style={styles.td}>
                    <span style={{
                      background: `${colorEstado[m.estado]}22`,
                      color: colorEstado[m.estado],
                      border: `1px solid ${colorEstado[m.estado]}44`,
                      borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 500
                    }}>{m.estado}</span>
                  </td>
                  <td style={{ ...styles.td, fontSize: 11, color: '#555', fontFamily: "'IBM Plex Mono', monospace" }}>{m.fecha}</td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={styles.btn('ghost')} onClick={() => abrirEditar(m)}>Editar</button>
                      {rol === 'admin' && (
                        <button style={styles.btn('danger')} onClick={() => eliminar(m.id)}>Eliminar</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {mantencionsFiltradas.length === 0 && (
              <tr><td colSpan={7} style={{ ...styles.td, textAlign: 'center', color: '#444', padding: 32 }}>No hay mantenciones registradas.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div style={styles.modal}>
          <div style={styles.modalBox}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 20 }}>
              {editId ? 'Editar Mantencion' : 'Nueva Mantencion'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={styles.label}>Activo *</label>
                <select style={styles.input} value={form.activo_id} onChange={e => setForm(f => ({ ...f, activo_id: e.target.value }))}>
                  <option value="">-- Seleccionar activo --</option>
                  {activos.map(a => <option key={a.id} value={a.id}>{a.nombre} — {a.serie}</option>)}
                </select>
              </div>
              <div>
                <label style={styles.label}>Tipo</label>
                <select style={styles.input} value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
                  {TIPOS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={styles.label}>Estado</label>
                <select style={styles.input} value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}>
                  {ESTADOS.map(e => <option key={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label style={styles.label}>Tecnico *</label>
                <input style={styles.input} placeholder="Nombre del tecnico" value={form.tecnico} onChange={e => setForm(f => ({ ...f, tecnico: e.target.value }))} />
              </div>
              <div>
                <label style={styles.label}>Fecha inicio</label>
                <input style={styles.input} type="date" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={styles.label}>Descripcion *</label>
                <input style={styles.input} placeholder="Describe la mantencion" value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <button style={styles.btn('ghost')} onClick={() => setModal(false)}>Cancelar</button>
              <button style={styles.btn('primary')} onClick={guardar} disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}