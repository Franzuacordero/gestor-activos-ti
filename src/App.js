import { useState, useEffect } from 'react';
import { styles } from './styles/styles';
import { getActivos, getHistorial } from './api';
import Dashboard    from './components/Dashboard';
import Activos      from './components/Activos';
import Asignacion   from './components/Asignacion';
import Reporteria   from './components/Reporteria';
import Mantenciones from './components/Mantenciones';
import Login        from './components/Login';

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',    icon: '▦' },
  { id: 'activos',      label: 'Activos',      icon: '◈' },
  { id: 'asignacion',   label: 'Asignacion',   icon: '⇄' },
  { id: 'mantenciones', label: 'Mantenciones', icon: '⚙' },
  { id: 'reporteria',   label: 'Reporteria',   icon: '▤' },
];

export default function App() {
  const [pagina,    setPagina]   = useState('dashboard');
  const [activos,   setActivos]  = useState([]);
  const [historial, setHistorial]= useState([]);
  const [usuario,   setUsuario]  = useState(localStorage.getItem('username'));
  const [rol,       setRol]      = useState(localStorage.getItem('rol'));
  const [loading,   setLoading]  = useState(false);

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

  if (!usuario) return <Login onLogin={(username) => {
    setUsuario(username);
    setRol(localStorage.getItem('rol'));
  }} />;

  return (
    <div style={styles.root}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } select option { background: #1a1a1a; }`}</style>

      <nav style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoTitle}>SoporteTech</div>
          <div style={styles.logoSub}>Gestor de Activos TI</div>
        </div>
        {NAV.map(n => (
          <div key={n.id} style={styles.navItem(pagina === n.id)} onClick={() => setPagina(n.id)}>
            <span style={{ fontSize: 16 }}>{n.icon}</span>
            <span>{n.label}</span>
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ padding: '16px 20px', borderTop: '1px solid #222' }}>
          <div style={{ fontSize: 12, color: '#ddd', marginBottom: 4 }}>{usuario}</div>
          <div style={{
            fontSize: 10, color: rol === 'admin' ? '#4fc3f7' : '#ffa726',
            marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1
          }}>{rol || 'tecnico'}</div>
          <button style={{ ...styles.btn('danger'), width: '100%', fontSize: 11 }} onClick={handleLogout}>
            Cerrar sesion
          </button>
        </div>
      </nav>

      <main style={styles.main}>
        {loading ? (
          <div style={{ color: '#555', fontSize: 13, marginTop: 100, textAlign: 'center' }}>
            Cargando datos...
          </div>
        ) : (
          <>
            {pagina === 'dashboard'    && <Dashboard    activos={activos} historial={historial} />}
            {pagina === 'activos'      && <Activos      activos={activos} setActivos={setActivos} setHistorial={setHistorial} cargarDatos={cargarDatos} rol={rol} />}
            {pagina === 'asignacion'   && <Asignacion   activos={activos} setActivos={setActivos} historial={historial} setHistorial={setHistorial} cargarDatos={cargarDatos} rol={rol} />}
            {pagina === 'mantenciones' && <Mantenciones activos={activos} rol={rol} cargarDatos={cargarDatos} />}
            {pagina === 'reporteria'   && <Reporteria   activos={activos} historial={historial} />}
          </>
        )}
      </main>
    </div>
  );
}