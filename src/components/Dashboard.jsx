import { styles } from '../styles/styles';

export default function Dashboard({ activos, historial }) {
  const operativos   = activos.filter(a => a.estado === 'Operativo').length;
  const enReparacion = activos.filter(a => a.estado === 'En reparacion').length;
  const dadosDeBaja  = activos.filter(a => a.estado === 'Dado de baja').length;

  return (
    <div>
      <div style={styles.pageTitle}>Dashboard</div>
      <div style={styles.pageSub}>Resumen general del inventario — SoporteTech Ltda.</div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
        {[
          { num: activos.length, label: 'Total activos',    color: '#4fc3f7' },
          { num: operativos,     label: 'Operativos',       color: '#66bb6a' },
          { num: enReparacion,   label: 'En reparacion',    color: '#ffa726' },
          { num: dadosDeBaja,    label: 'Dados de baja',    color: '#ef5350' },
        ].map((s, i) => (
          <div key={i} style={styles.statCard}>
            <div style={{ ...styles.statNum, color: s.color }}>{s.num}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={styles.card}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#888', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Activos recientes
          </div>
          {activos.slice(-4).reverse().map(a => (
            <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #1a1a1a' }}>
              <div>
                <div style={{ fontSize: 13, color: '#ddd' }}>{a.nombre}</div>
                <div style={{ fontSize: 11, color: '#555' }}>{a.serie}</div>
              </div>
              <span style={styles.badge(a.estado)}>{a.estado}</span>
            </div>
          ))}
        </div>

        <div style={styles.card}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#888', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Actividad reciente
          </div>
          {historial.slice(-4).reverse().map(h => (
            <div key={h.id} style={{ padding: '8px 0', borderBottom: '1px solid #1a1a1a' }}>
              <div style={{ fontSize: 12, color: '#4fc3f7' }}>{h.tipo}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{h.descripcion}</div>
              <div style={{ fontSize: 11, color: '#444', marginTop: 2 }}>{h.fecha}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
