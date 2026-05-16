import { useState } from 'react';
import { styles } from '../styles/styles';
import { asignarActivo, desasignarActivo } from '../api';

export default function Asignacion({ activos, setActivos, historial, setHistorial, cargarDatos }) {
  const [form, setForm] = useState({ activoId: '', persona: '', descripcion: '' });
  const [modalDesasignar, setModalDesasignar] = useState(null);
  const [loading, setLoading] = useState(false);

  const disponibles = activos.filter(a => !a.asignado_a && a.estado === 'Operativo');
  const asignados   = activos.filter(a => a.asignado_a);

  async function asignar() {
    if (!form.activoId || !form.persona) return alert('Selecciona un activo y escribe el nombre del responsable.');
    setLoading(true);
    try {
      await asignarActivo(Number(form.activoId), form.persona, form.descripcion);
      await cargarDatos();
      setForm({ activoId: '', persona: '', descripcion: '' });
    } catch (err) {
      alert('Error al asignar');
    } finally {
      setLoading(false);
    }
  }

  async function desasignar(id) {
    try {
      await desasignarActivo(id);
      await cargarDatos();
      setModalDesasignar(null);
    } catch (err) {
      alert('Error al desasignar');
    }
  }

  return (
    <div>
      <div style={styles.pageTitle}>Asignacion y Seguimiento</div>
      <div style={styles.pageSub}>Asigna equipos a tecnicos o usuarios y controla su uso.</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        <div style={styles.card}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#888', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Nueva Asignacion
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={styles.label}>Activo disponible</label>
            <select style={styles.input} value={form.activoId} onChange={e => setForm(f => ({ ...f, activoId: e.target.value }))}>
              <option value="">-- Seleccionar activo --</option>
              {disponibles.map(a => <option key={a.id} value={a.id}>{a.nombre} — {a.serie}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={styles.label}>Asignar a</label>
            <input style={styles.input} placeholder="Nombre del responsable" value={form.persona} onChange={e => setForm(f => ({ ...f, persona: e.target.value }))} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={styles.label}>Descripcion (opcional)</label>
            <input style={styles.input} placeholder="Ej: Para trabajo remoto" value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
          </div>
          <button style={{ ...styles.btn('success'), width: '100%' }} onClick={asignar} disabled={loading}>
            {loading ? 'Asignando...' : 'Confirmar Asignacion'}
          </button>
        </div>

        <div style={styles.card}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#888', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Activos Asignados ({asignados.length})
          </div>
          {asignados.length === 0 && <div style={{ color: '#444', fontSize: 13 }}>No hay activos asignados actualmente.</div>}
          {asignados.map(a => (
            <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #1a1a1a' }}>
              <div>
                <div style={{ fontSize: 13, color: '#ddd' }}>{a.nombre}</div>
                <div style={{ fontSize: 11, color: '#4fc3f7', marginTop: 2 }}>{a.asignado_a}</div>
              </div>
              <button style={styles.btn('danger')} onClick={() => setModalDesasignar(a.id)}>Desasignar</button>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.card}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#888', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Historial de movimientos
        </div>
        <table style={styles.table}>
          <thead>
            <tr>{['Fecha', 'Activo', 'Tipo', 'Descripcion', 'Tecnico'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {[...historial].reverse().map(h => {
              const activo = activos.find(a => a.id === h.activo_id);
              return (
                <tr key={h.id}>
                  <td style={{ ...styles.td, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#555' }}>{h.fecha}</td>
                  <td style={styles.td}>{activo?.nombre || '—'}</td>
                  <td style={styles.td}>
                    <span style={{ color: h.tipo === 'Asignacion' ? '#66bb6a' : h.tipo === 'Desasignacion' ? '#ef5350' : '#ffa726', fontSize: 12 }}>
                      {h.tipo}
                    </span>
                  </td>
                  <td style={{ ...styles.td, color: '#777' }}>{h.descripcion}</td>
                  <td style={{ ...styles.td, color: '#555', fontSize: 12 }}>{h.tecnico}</td>
                </tr>
              );
            })}
            {historial.length === 0 && (
              <tr><td colSpan={5} style={{ ...styles.td, textAlign: 'center', color: '#444', padding: 32 }}>No hay movimientos registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modalDesasignar && (
        <div style={styles.modal}>
          <div style={{ ...styles.modalBox, width: 340 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 12 }}>Confirmar desasignacion</div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>¿Seguro que quieres desasignar este activo?</div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button style={styles.btn('ghost')}  onClick={() => setModalDesasignar(null)}>Cancelar</button>
              <button style={styles.btn('danger')} onClick={() => desasignar(modalDesasignar)}>Desasignar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}