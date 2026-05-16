import { styles } from '../styles/styles';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Reporteria({ activos, historial }) {
  const operativos = activos.filter(a => a.estado === 'Operativo').length;
  const enRep      = activos.filter(a => a.estado === 'En reparacion').length;
  const baja       = activos.filter(a => a.estado === 'Dado de baja').length;
  const asignados  = activos.filter(a => a.asignado_a).length;
  const libres     = activos.filter(a => !a.asignado_a && a.estado === 'Operativo').length;

  const porTipo = activos.reduce((acc, a) => {
    acc[a.tipo] = (acc[a.tipo] || 0) + 1;
    return acc;
  }, {});

  function exportarCSV() {
    const headers = ['ID', 'Nombre', 'Tipo', 'Marca', 'Modelo', 'Serie', 'Estado', 'Asignado a', 'Fecha ingreso'];
    const rows = activos.map(a => [a.id, a.nombre, a.tipo, a.marca, a.modelo, a.serie, a.estado, a.asignado_a || '', a.fecha]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventario_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  function exportarPDF() {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString('es-CL');

    // Título
    doc.setFontSize(18);
    doc.setTextColor(31, 78, 121);
    doc.text('SoporteTech Ltda.', 14, 20);
    doc.setFontSize(13);
    doc.setTextColor(100);
    doc.text('Reporte de Inventario de Activos Tecnologicos', 14, 28);
    doc.setFontSize(10);
    doc.text(`Fecha: ${fecha}`, 14, 35);

    // Estadísticas
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Resumen del Inventario', 14, 45);
    autoTable(doc, {
      startY: 48,
      head: [['Indicador', 'Cantidad']],
      body: [
        ['Total activos', activos.length],
        ['Operativos', operativos],
        ['Asignados', asignados],
        ['Disponibles', libres],
        ['En reparacion', enRep],
        ['Dados de baja', baja],
      ],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [31, 78, 121] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Tabla de activos
    doc.text('Detalle de Activos', 14, doc.lastAutoTable.finalY + 10);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 13,
      head: [['Nombre', 'Tipo', 'Serie', 'Estado', 'Asignado a']],
      body: activos.map(a => [a.nombre, a.tipo, a.serie, a.estado, a.asignado_a || '—']),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [31, 78, 121] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save(`reporte_activos_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  return (
    <div>
      <div style={styles.pageTitle}>Reporteria</div>
      <div style={styles.pageSub}>Resumen del estado del inventario y exportacion de datos.</div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {[
          { num: activos.length, label: 'Total activos',  color: '#4fc3f7' },
          { num: asignados,      label: 'Asignados',      color: '#66bb6a' },
          { num: libres,         label: 'Disponibles',    color: '#ab47bc' },
          { num: enRep,          label: 'En reparacion',  color: '#ffa726' },
          { num: baja,           label: 'Dados de baja',  color: '#ef5350' },
        ].map((s, i) => (
          <div key={i} style={styles.statCard}>
            <div style={{ ...styles.statNum, color: s.color }}>{s.num}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={styles.card}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#888', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Distribucion por tipo
          </div>
          {Object.entries(porTipo).map(([tipo, count]) => (
            <div key={tipo} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888', marginBottom: 4 }}>
                <span>{tipo}</span><span>{count}</span>
              </div>
              <div style={{ background: '#1a1a1a', borderRadius: 4, height: 6 }}>
                <div style={{ background: '#4fc3f7', borderRadius: 4, height: 6, width: `${(count / activos.length) * 100}%`, transition: 'width 0.5s' }} />
              </div>
            </div>
          ))}
        </div>

        <div style={styles.card}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#888', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Distribucion por estado
          </div>
          {[
            { label: 'Operativo',     count: operativos, color: '#66bb6a' },
            { label: 'En reparacion', count: enRep,      color: '#ffa726' },
            { label: 'Dado de baja',  count: baja,       color: '#ef5350' },
          ].map(s => (
            <div key={s.label} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888', marginBottom: 4 }}>
                <span>{s.label}</span><span>{s.count}</span>
              </div>
              <div style={{ background: '#1a1a1a', borderRadius: 4, height: 6 }}>
                <div style={{ background: s.color, borderRadius: 4, height: 6, width: activos.length ? `${(s.count / activos.length) * 100}%` : '0%', transition: 'width 0.5s' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>Inventario completo</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={styles.btn('ghost')} onClick={exportarCSV}>Exportar CSV</button>
            <button style={styles.btn('primary')} onClick={exportarPDF}>Exportar PDF</button>
          </div>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>{['Nombre', 'Tipo', 'Serie', 'Estado', 'Asignado a', 'Fecha ingreso'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {activos.map(a => (
              <tr key={a.id}>
                <td style={styles.td}>{a.nombre}</td>
                <td style={{ ...styles.td, color: '#666' }}>{a.tipo}</td>
                <td style={{ ...styles.td, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#4fc3f7' }}>{a.serie}</td>
                <td style={styles.td}><span style={styles.badge(a.estado)}>{a.estado}</span></td>
                <td style={{ ...styles.td, color: a.asignado_a ? '#ddd' : '#444' }}>{a.asignado_a || '—'}</td>
                <td style={{ ...styles.td, fontSize: 12, color: '#555' }}>{a.fecha || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}