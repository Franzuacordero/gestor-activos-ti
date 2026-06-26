import { useState } from 'react';
import { login } from '../api';
import { styles } from '../styles/styles';

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mostrarPass, setMostrarPass] = useState(false);

  async function handleLogin() {
    if (!form.username || !form.password) return setError('Completa todos los campos.');
    setLoading(true);
    setError('');
    try {
      const data = await login(form.username, form.password);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('username', form.username);
      localStorage.setItem('rol', data.rol);
      onLogin(form.username);
    } catch (err) {
      setError('Usuario o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      background: '#0a0a0a', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'IBM Plex Sans', sans-serif"
    }}>
      <div style={{
        background: '#141414', border: '1px solid #222',
        borderRadius: 10, padding: 40, width: 360
      }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 20, fontWeight: 600, color: '#4fc3f7',
          marginBottom: 6
        }}>SoporteTech</div>
        <div style={{ fontSize: 13, color: '#555', marginBottom: 32 }}>
          Gestor de Activos TI
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={styles.label}>Usuario</label>
          <input
            style={styles.input}
            placeholder="admin"
            value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={styles.label}>Contraseña</label>
          <div style={{ position: 'relative' }}>
            <input
              type={mostrarPass ? 'text' : 'password'}
              style={{ ...styles.input, paddingRight: 42 }}
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            <button
              type="button"
              onClick={() => setMostrarPass(!mostrarPass)}
              style={{
                position: 'absolute', right: 10, top: '50%',
                transform: 'translateY(-50%)', background: 'none',
                border: 'none', cursor: 'pointer',
                color: mostrarPass ? '#4fc3f7' : '#555',
                display: 'flex', alignItems: 'center', padding: 0
              }}
            >
              {mostrarPass ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            background: '#2a0a0a', border: '1px solid #4a1a1a',
            borderRadius: 6, padding: '8px 12px',
            fontSize: 12, color: '#ef5350', marginBottom: 16
          }}>{error}</div>
        )}

        <button
          style={{ ...styles.btn('primary'), width: '100%', padding: '10px 16px', fontSize: 14 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </div>
    </div>
  );
}