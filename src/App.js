import { useState, useEffect } from 'react';
import { styles } from './styles/styles';
import { getActivos, getHistorial, cambiarPassword } from './api';
import Dashboard    from './components/Dashboard';
import Activos      from './components/Activos';
import Asignacion   from './components/Asignacion';
import Reporteria   from './components/Reporteria';
import Mantenciones from './components/Mantenciones';
import Usuarios     from './components/Usuarios';
import Login        from './components/Login';
import Notificaciones from './components/Notificaciones';

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',    icon: '▦' },
  { id: 'activos',      label: 'Activos',      icon: '◈' },
  { id: 'asignacion',   label: 'Asignacion',   icon: '⇄' },
  { id: 'mantenciones', label: 'Mantenciones', icon: '⚙' },
  { id: 'reporteria',   label: 'Reporteria',   icon: '▤' },
  { id: 'usuarios',     label: 'Usuarios',     icon: '👤' },
];

export default function App() {
  const [pagina,    setPagina]    = useState('dashboard');
  const [activos,   setActivos]   = useState([]);
  const [historial, setHistorial] = useState([]);
  const [usuario,   setUsuario]   = useState(null);
  const [rol,       setRol]       = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [modalPassword, setModalPassword] = useState(false);
  const [formPassword, setFormPassword] = useState({ password_actual: '', nueva_password: '', confirmar: '' });
  const [errorPassword, setErrorPassword] = useState('');
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    if (usuario) cargarDatos();
  }, [usuario]);

  async function cargarDatos() {
    setLoading(true);
    try {
      const [a, h] = await Promise.all([getActivos(), getHistorial()]);
      setActivos(a);
      setHistorial(h);
    } catch (err) {
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('rol');
    setUsuario(null);
    setRol(null);
    setActivos([]);
    setHistorial([]);
  }

  async function handleCambiarPassword() {
    if (!formPassword.password_actual || !formPassword.nueva_password || !formPassword.confirmar)
      return setErrorPassword('Completa todos los campos.');
    if (formPassword.nueva_password.length < 6)
      return setErrorPassword('La nueva contraseña debe tener al menos 6 caracteres.');
    if (formPassword.nueva_password !== formPassword.confirmar)
      return setErrorPassword('Las contraseñas no coinciden.');
    setLoadingPassword(true);
    setErrorPassword('');
    try {
      await cambiarPassword({
        password_actual: formPassword.password_actual,
        nueva_password: formPassword.nueva_password
      });
      setModalPassword(false);
      setFormPassword({ password_actual: '', nueva_password: '', confirmar: '' });
      alert('Contraseña actualizada correctamente.');
    } catch (err) {
      setErrorPassword(err.response?.data?.detail || 'Error al cambiar contraseña.');
    } finally {
      setLoadingPassword(false);
    }
  }

  if (!usuario) return <Login onLogin={(username) => {
    setUsuario(username);
    setRol(localStorage.getItem('rol'));
  }} />;

  const spinner = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: 150, gap: 16 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #222', borderTop: '3px solid #4fc3f7', animation: 'spin 0.8s linear infinite' }} />
      <div style={{ color: '#555', fontSize: 13 }}>Cargando datos...</div>
    </div>
  );

  const contenido = (
    <>
      {pagina === 'dashboard'    && <Dashboard    activos={activos} historial={historial} />}
      {pagina === 'activos'      && <Activos      activos={activos} setActivos={setActivos} setHistorial={setHistorial} cargarDatos={cargarDatos} rol={rol} />}
      {pagina === 'asignacion'   && <Asignacion   activos={activos} setActivos={setActivos} historial={historial} setHistorial={setHistorial} cargarDatos={cargarDatos} rol={rol} />}
      {pagina === 'mantenciones' && <Mantenciones activos={activos} rol={rol} cargarDatos={cargarDatos} />}
      {pagina === 'reporteria'   && <Reporteria   activos={activos} historial={historial} />}
      {pagina === 'usuarios'     && <Usuarios     rol={rol} />}
    </>
  );

  return (
    <div style={styles.root}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } select option { background: #1a1a1a; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <nav style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoTitle}>SoporteTech</div>
          <div style={styles.logoSub}>Gestor de Activos TI</div>
        </div>

        {NAV.map(n => (
          <div key={n.id} style={styles.navItem(pagina === n.id)} onClick={() => setPagina(n.id)}>
            <span style={{ fontSize: 16 }}>{n.icon}</span>
            <span style={{ flex: 1 }}>{n.label}</span>
            {n.id === 'activos' && activos.filter(a => a.estado === 'En reparacion').length > 0 && (
              <span style={{ background: '#ef5350', color: '#fff', borderRadius: 10, fontSize: 10, padding: '1px 6px', fontWeight: 700 }}>
                {activos.filter(a => a.estado === 'En reparacion').length}
              </span>
            )}
          </div>
        ))}

        <div style={{ flex: 1 }} />

        <div style={{ padding: '16px 20px', borderTop: '1px solid #222' }}>
          <button
            style={{ ...styles.btn('ghost'), width: '100%', fontSize: 11, marginBottom: 8 }}
            onClick={() => setMostrarNotificaciones(true)}
          >
            🔔 Notificaciones
          </button>
          <button
            style={{ ...styles.btn('ghost'), width: '100%', fontSize: 11, marginBottom: 8 }}
            onClick={() => setModalPassword(true)}
          >
            🔑 Cambiar contraseña
          </button>
          <div style={{ fontSize: 12, color: '#ddd', marginBottom: 4 }}>{usuario}</div>
          <div style={{ fontSize: 10, color: rol === 'admin' ? '#4fc3f7' : '#ffa726', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            {rol || 'tecnico'}
          </div>
          <button style={{ ...styles.btn('danger'), width: '100%', fontSize: 11 }} onClick={handleLogout}>
            Cerrar sesion
          </button>
        </div>
      </nav>

      <main style={styles.main}>
        {loading ? spinner : contenido}
      </main>

      {/* Panel notificaciones */}
      {mostrarNotificaciones && <Notificaciones onClose={() => setMostrarNotificaciones(false)} />}

      {/* Modal cambiar contraseña */}
      {modalPassword && (
        <div style={styles.modal}>
          <div style={styles.modalBox}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 20 }}>
              Cambiar Contraseña
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={styles.label}>Contraseña actual</label>
                <input type="password" style={styles.input} placeholder="••••••••"
                  value={formPassword.password_actual}
                  onChange={e => setFormPassword(f => ({ ...f, password_actual: e.target.value }))} />
              </div>
              <div>
                <label style={styles.label}>Nueva contraseña</label>
                <input type="password" style={styles.input} placeholder="Mínimo 6 caracteres"
                  value={formPassword.nueva_password}
                  onChange={e => setFormPassword(f => ({ ...f, nueva_password: e.target.value }))} />
              </div>
              <div>
                <label style={styles.label}>Confirmar contraseña</label>
                <input type="password" style={styles.input} placeholder="Repite la nueva contraseña"
                  value={formPassword.confirmar}
                  onChange={e => setFormPassword(f => ({ ...f, confirmar: e.target.value }))} />
              </div>
              {errorPassword && (
                <div style={{ background: '#2a0a0a', border: '1px solid #4a1a1a', borderRadius: 6, padding: '8px 12px', fontSize: 12, color: '#ef5350' }}>
                  {errorPassword}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <button style={styles.btn('ghost')} onClick={() => {
                setModalPassword(false);
                setFormPassword({ password_actual: '', nueva_password: '', confirmar: '' });
                setErrorPassword('');
              }}>Cancelar</button>
              <button style={styles.btn('primary')} onClick={handleCambiarPassword} disabled={loadingPassword}>
                {loadingPassword ? 'Guardando...' : 'Cambiar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}