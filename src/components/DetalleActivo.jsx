import { useState, useEffect } from 'react';
import { styles } from '../styles/styles';
import { getDetalleActivo } from '../api';

export default function DetalleActivo({ activoId, onVolver }) {
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { cargarDetalle(); }, [activoId]);

  async function cargarDetalle() {
    try {
      const data = await getDetalleActivo(activoId);
      setDetalle(data);
    } catch (err) {
      console.error('Error cargando detalle:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 150, gap: 16 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #222', borderTop: '3px solid #4fc3f7', animation: 'spin 0.8s linear infinite' }} />
      <div style={{ color: '#555', fontSize: 13 }}>Cargando detalle...</div>
    </div>
  );

  if (!detalle) return null;

  const { activo, historial, mantenciones } = detalle;
  const colorMantencion = { 'Pendiente': '#ffa726', 'En proceso': '#4fc3f7', 'Completada': '#66bb6a' };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button style={styles.btn('ghost')} onClick={onVolver}>← Volver</button>
        <div style={styles.pageTitle}>Detalle del Activo</div>
      </div>

      {/* Info del activo */}
      <div style={{ ...styles.card, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#888', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Información General
        </div>

        <div style={{ display: 'flex', gap: 24 }}>
          {/* Foto */}
          <div style={{ flexShrink: 0 }}>
            {activo.foto_url ? (
              <img
                src={activo.foto_url}
                alt="foto activo"
                style={{ width: 160, height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid #222' }}
              />
            ) : (
              <div style={{
                width: 160, height: 120, background: '#1a1a1a', borderRadius: 8,
                border: '1px solid #222', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 8
              }}>
                <div style={{ fontSize: 32 }}>📦</div>
                <div style={{ fontSize: 11, color: '#444' }}>Sin foto</div>
              </div>
            )}
          </div>

          {/* Datos */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
              {[
                { label: 'Nombre', value: activo.nombre },
                { label: 'Tipo', value: activo.tipo },
                { label: 'Marca', value: activo.marca },
                { label: 'Modelo', value: activo.modelo },
                { label: 'N° Serie', value: activo.serie },
                { label: 'Fecha Ingreso', value: activo.fecha },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ fontSize: 11, color: '#555', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: '#ddd' }}>{item.value || '—'}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: '#555', marginBottom: 4 }}>Estado</div>
                <span style={styles.badge(activo.estado)}>{activo.estado}</span>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#555', marginBottom: 4 }}>Asignado a</div>
                <div style={{ fontSize: 13, color: activo.asignado_a ? '#4fc3f7' : '#444' }}>
                  {activo.asignado_a || 'Sin asignar'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historial */}
      <div style={{ ...styles.card, marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#888', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Historial de Movimientos ({historial.length})
        </div>
        {historial.length === 0 && <div style={{ color: '#444', fontSize: 13 }}>Sin movimientos registrados.</div>}
        {historial.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr>{['Fecha', 'Tipo', 'Descripción', 'Técnico'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {[...historial].reverse().map(h => (
                <tr key={h.id}>
                  <td style={{ ...styles.td, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#555' }}>{h.fecha}</td>
                  <td style={styles.td}>
                    <span style={{ color: h.tipo === 'Asignacion' ? '#66bb6a' : h.tipo === 'Desasignacion' ? '#ef5350' : '#ffa726', fontSize: 12 }}>
                      {h.tipo}
                    </span>
                  </td>
                  <td style={{ ...styles.td, color: '#777' }}>{h.descripcion}</td>
                  <td style={{ ...styles.td, color: '#555', fontSize: 12 }}>{h.tecnico}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Mantenciones */}
      <div style={styles.card}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#888', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Mantenciones ({mantenciones.length})
        </div>
        {mantenciones.length === 0 && <div style={{ color: '#444', fontSize: 13 }}>Sin mantenciones registradas.</div>}
        {mantenciones.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr>{['Tipo', 'Descripción', 'Técnico', 'Estado', 'Fecha'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {mantenciones.map(m => (
                <tr key={m.id}>
                  <td style={{ ...styles.td, color: '#888' }}>{m.tipo}</td>
                  <td style={{ ...styles.td, color: '#888', maxWidth: 200 }}>{m.descripcion}</td>
                  <td style={{ ...styles.td, color: '#888' }}>{m.tecnico}</td>
                  <td style={styles.td}>
                    <span style={{
                      background: `${colorMantencion[m.estado]}22`,
                      color: colorMantencion[m.estado],
                      border: `1px solid ${colorMantencion[m.estado]}44`,
                      borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 500
                    }}>{m.estado}</span>
                  </td>
                  <td style={{ ...styles.td, fontSize: 11, color: '#555', fontFamily: "'IBM Plex Mono', monospace" }}>{m.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}