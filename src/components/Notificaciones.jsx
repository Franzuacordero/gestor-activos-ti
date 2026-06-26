import { useState, useEffect } from 'react';
import { styles } from '../styles/styles';
import { getNotificaciones } from '../api';

export default function Notificaciones({ onClose }) {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { cargarAlertas(); }, []);

  async function cargarAlertas() {
    try {
      const data = await getNotificaciones();
      setAlertas(data);
    } catch (err) {
      console.error('Error cargando notificaciones:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, width: 380, height: '100vh',
      background: '#161B22', borderLeft: '1px solid #222',
      zIndex: 1000, display: 'flex', flexDirection: 'column',
      boxShadow: '-4px 0 20px rgba(0,0,0,0.5)'
    }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Notificaciones</div>
          <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>Activos en reparación por más de 7 días</div>
        </div>
        <button style={styles.btn('ghost')} onClick={onClose}>✕</button>
      </div>

      {/* Contenido */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {loading && (
          <div style={{ color: '#555', fontSize: 13, textAlign: 'center', marginTop: 40 }}>Cargando...</div>
        )}
        {!loading && alertas.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 60 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
            <div style={{ color: '#66bb6a', fontSize: 14, fontWeight: 500 }}>Sin alertas activas</div>
            <div style={{ color: '#555', fontSize: 12, marginTop: 6 }}>Todos los activos están en buen estado</div>
          </div>
        )}
        {!loading && alertas.map(a => (
          <div key={a.id} style={{
            background: '#0D1117', border: '1px solid #ef535033',
            borderLeft: '3px solid #ef5350', borderRadius: 6,
            padding: '12px 14px', marginBottom: 12
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{a.nombre}</div>
              <span style={{
                background: '#ef535022', color: '#ef5350',
                border: '1px solid #ef535044', borderRadius: 4,
                padding: '2px 8px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap'
              }}>{a.dias_en_reparacion} días</span>
            </div>
            <div style={{ fontSize: 11, color: '#4fc3f7', marginTop: 4 }}>{a.serie}</div>
            <div style={{ fontSize: 11, color: '#555', marginTop: 4 }}>En reparación desde: {a.fecha}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {!loading && alertas.length > 0 && (
        <div style={{ padding: '12px 16px', borderTop: '1px solid #222', fontSize: 12, color: '#555', textAlign: 'center' }}>
          {alertas.length} activo{alertas.length > 1 ? 's' : ''} requiere{alertas.length === 1 ? '' : 'n'} atención
        </div>
      )}
    </div>
  );
}