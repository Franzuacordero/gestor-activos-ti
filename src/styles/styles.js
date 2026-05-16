export const styles = {
  root: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    background: '#0a0a0a',
    minHeight: '100vh',
    color: '#e8e8e8',
  },
  sidebar: {
    width: 220,
    background: '#111',
    borderRight: '1px solid #222',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 0',
    position: 'fixed',
    top: 0, left: 0, bottom: 0,
  },
  logo: {
    padding: '0 20px 24px',
    borderBottom: '1px solid #222',
    marginBottom: 16,
  },
  logoTitle: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 13, fontWeight: 600,
    color: '#4fc3f7', letterSpacing: 1,
    textTransform: 'uppercase',
  },
  logoSub: { fontSize: 11, color: '#555', marginTop: 4 },
  navItem: (active) => ({
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 20px', cursor: 'pointer',
    background: active ? '#1a2a3a' : 'transparent',
    borderLeft: active ? '3px solid #4fc3f7' : '3px solid transparent',
    color: active ? '#4fc3f7' : '#888',
    fontSize: 13, fontWeight: active ? 500 : 400,
    transition: 'all 0.15s',
  }),
  main: {
    marginLeft: 220,
    padding: '32px 36px',
    minHeight: '100vh',
  },
  pageTitle: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 20, fontWeight: 600, color: '#fff',
    marginBottom: 6,
  },
  pageSub: { fontSize: 13, color: '#666', marginBottom: 28 },
  card: {
    background: '#141414',
    border: '1px solid #222',
    borderRadius: 8,
    padding: '20px 24px',
    marginBottom: 16,
  },
  btn: (variant = 'primary') => ({
    padding: '8px 16px', borderRadius: 6, border: 'none',
    cursor: 'pointer', fontSize: 12, fontWeight: 500,
    background: variant === 'primary' ? '#4fc3f7'
      : variant === 'danger' ? '#ef5350'
      : variant === 'success' ? '#66bb6a'
      : '#222',
    color: variant === 'primary' ? '#000' : variant === 'ghost' ? '#888' : '#fff',
    transition: 'opacity 0.15s',
  }),
  badge: (estado) => {
    const map = {
      'Operativo':      { bg: '#0a2a0a', color: '#66bb6a', border: '#1a4a1a' },
      'En reparacion':  { bg: '#2a1a00', color: '#ffa726', border: '#4a3000' },
      'Dado de baja':   { bg: '#2a0a0a', color: '#ef5350', border: '#4a1a1a' },
    };
    const s = map[estado] || map['Operativo'];
    return { background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 500 };
  },
  input: {
    background: '#1a1a1a', border: '1px solid #333', borderRadius: 6,
    color: '#e8e8e8', padding: '8px 12px', fontSize: 13, width: '100%',
    outline: 'none', boxSizing: 'border-box',
  },
  label: { fontSize: 12, color: '#666', marginBottom: 4, display: 'block' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'left', fontSize: 11, color: '#555', fontWeight: 500,
    padding: '8px 12px', borderBottom: '1px solid #1e1e1e',
    textTransform: 'uppercase', letterSpacing: 0.5
  },
  td: { padding: '12px 12px', fontSize: 13, borderBottom: '1px solid #1a1a1a', color: '#ccc' },
  statCard: {
    background: '#141414', border: '1px solid #222',
    borderRadius: 8, padding: '20px 24px', flex: 1
  },
  statNum: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 32, fontWeight: 600, color: '#4fc3f7'
  },
  statLabel: { fontSize: 12, color: '#555', marginTop: 4 },
  modal: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
  },
  modalBox: {
    background: '#141414', border: '1px solid #333', borderRadius: 10,
    padding: 28, width: 480, maxHeight: '90vh', overflowY: 'auto',
  },
};
