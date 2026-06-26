import { useState, useEffect } from 'react';
import { styles } from '../styles/styles';
import { getUsuarios, crearUsuario, eliminarUsuario } from '../api';

const ROLES = ['admin', 'tecnico'];

const FORM_INICIAL = { username: '', password: '', rol: 'tecnico' };

export default function Usuarios({ rol }) {
  const [usuarios, setUsuarios] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(FORM_INICIAL);
  const [loading, setLoading] = useState(false);

  useEffect(() => { cargarUsuarios(); }, []);

  async function cargarUsuarios() {
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
    }
  }

  async function guardar() {
    if (!form.username.trim()) return alert('El nombre de usuario es obligatorio.');
    if (!form.password.trim()) return alert('La contraseña es obligatoria.');
    if (form.password.length < 6) return alert('La contraseña debe tener al menos 6 caracteres.');
    setLoading(true);
    try {
      await crearUsuario(form);
      await cargarUsuarios();
      setModal(false);
      setForm(FORM_INICIAL);
    } catch (err) {
      alert(err.response?.data?.detail || 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  }

  async function eliminar(id) {
    if (!window.confirm('¿Eliminar este usuario?')) return;
    try {
      await eliminarUsuario(id);
      await cargarUsuarios();
    } catch (err) {
      alert(err.response?.data?.detail || 'Error al eliminar usuario');
    }
  }

  if (rol !== 'admin') return (
    <div style={{ color: '#555', textAlign: 'center', marginTop: 100, fontSize: 14 }}>
      Solo los administradores pueden gestionar usuarios.
    </div>
  );

  return (
    <div>
      <div style={styles.pageTitle}>Gestión de Usuarios</div>
      <div style={styles.pageSub}>Administra los usuarios del sistema.</div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total', count: usuarios.length, color: '#4fc3f7' },
          { label: 'Administradores', count: usuarios.filter(u => u.rol === 'admin').length, color: '#ab47bc' },
          { label: 'Técnicos', count: usuarios.filter(u => u.rol === 'tecnico').length, color: '#66bb6a' },
        ].map((s, i) => (
          <div key={i} style={styles.statCard}>
            <div style={{ ...styles.statNum, color: s.color }}>{s.count}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button style={styles.btn('primary')} onClick={() => setModal(true)}>+ Nuevo Usuario</button>
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>{['ID', 'Username', 'Rol', 'Acciones'].map(h => (
              <th key={h} style={styles.th}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id}>
                <td style={{ ...styles.td, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#555' }}>{u.id}</td>
                <td style={styles.td}>{u.username}</td>
                <td style={styles.td}>
                  <span style={{
                    background: u.rol === 'admin' ? '#4fc3f722' : '#66bb6a22',
                    color: u.rol === 'admin' ? '#4fc3f7' : '#66bb6a',
                    border: `1px solid ${u.rol === 'admin' ? '#4fc3f744' : '#66bb6a44'}`,
                    borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 500
                  }}>{u.rol}</span>
                </td>
                <td style={styles.td}>
                  <button style={styles.btn('danger')} onClick={() => eliminar(u.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr><td colSpan={4} style={{ ...styles.td, textAlign: 'center', color: '#444', padding: 32 }}>No hay usuarios registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div style={styles.modal}>
          <div style={styles.modalBox}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 20 }}>
              Nuevo Usuario
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={styles.label}>Username *</label>
                <input style={styles.input} placeholder="Nombre de usuario" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
              </div>
              <div>
                <label style={styles.label}>Contraseña *</label>
                <input style={styles.input} type="password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              </div>
              <div>
                <label style={styles.label}>Rol</label>
                <select style={styles.input} value={form.rol} onChange={e => setForm(f => ({ ...f, rol: e.target.value }))}>
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <button style={styles.btn('ghost')} onClick={() => { setModal(false); setForm(FORM_INICIAL); }}>Cancelar</button>
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