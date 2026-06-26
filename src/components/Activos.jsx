import { useState } from 'react';
import { styles } from '../styles/styles';
import { TIPOS, ESTADOS } from '../data/datosIniciales';
import { crearActivo, actualizarActivo, eliminarActivo } from '../api';
import DetalleActivo from './DetalleActivo';

const FORM_INICIAL = { nombre: '', tipo: 'Computador', marca: '', modelo: '', serie: '', estado: 'Operativo', fecha: '' };
const ITEMS_POR_PAGINA = 8;

export default function Activos({ activos, setActivos, setHistorial, cargarDatos, rol }) {
  const [modal,   setModal]   = useState(false);
  const [filtro,  setFiltro]  = useState('');
  const [form,    setForm]    = useState(FORM_INICIAL);
  const [editId,  setEditId]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [filtroTipo,   setFiltroTipo]   = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [activoSeleccionado, setActivoSeleccionado] = useState(null);
  //  Paginación
  const [pagina, setPagina] = useState(1);

  const activosFiltrados = activos.filter(a =>
    (a.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
     a.serie.toLowerCase().includes(filtro.toLowerCase())) &&
    (filtroTipo   ? a.tipo   === filtroTipo   : true) &&
    (filtroEstado ? a.estado === filtroEstado : true)
  );

  //  Paginación
  const totalPaginas = Math.ceil(activosFiltrados.length / ITEMS_POR_PAGINA);
  const activosPaginados = activosFiltrados.slice(
    (pagina - 1) * ITEMS_POR_PAGINA,
    pagina * ITEMS_POR_PAGINA
  );

  function abrirNuevo() {
    setForm(FORM_INICIAL);
    setEditId(null);
    setModal(true);
  }

  function abrirEditar(a) {
    setForm({ nombre: a.nombre, tipo: a.tipo, marca: a.marca, modelo: a.modelo, serie: a.serie, estado: a.estado, fecha: a.fecha || '' });
    setEditId(a.id);
    setModal(true);
  }

  //  Validación robusta en formularios
  async function guardar() {
    if (!form.nombre.trim()) return alert('El nombre es obligatorio.');
    if (!form.tipo) return alert('El tipo es obligatorio.');
    if (!form.marca.trim()) return alert('La marca es obligatoria.');
    if (!form.modelo.trim()) return alert('El modelo es obligatorio.');
    if (!form.serie.trim()) return alert('El número de serie es obligatorio.');
    if (!form.estado) return alert('El estado es obligatorio.');
    if (!form.fecha) return alert('La fecha de ingreso es obligatoria.');
    setLoading(true);
    try {
      if (editId) {
        await actualizarActivo(editId, { ...form, asignado_a: activos.find(a => a.id === editId)?.asignado_a });
      } else {
        await crearActivo(form);
      }
      await cargarDatos();
      setModal(false);
      setForm(FORM_INICIAL);
      setEditId(null);
      setPagina(1);
    } catch (err) {
      alert(err.response?.data?.detail || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  }

  async function eliminar(id) {
    if (!window.confirm('¿Eliminar este activo?')) return;
    try {
      await eliminarActivo(id);
      await cargarDatos();
      setPagina(1);
    } catch (err) {
      alert('Error al eliminar');
    }
  }
  if (activoSeleccionado) return <DetalleActivo activoId={activoSeleccionado} onVolver={() => setActivoSeleccionado(null)} />;
  return (
    <div>
      <div style={styles.pageTitle}>Registro de Activos</div>
      <div style={styles.pageSub}>Gestiona el inventario de equipos e insumos tecnologicos.</div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 10 }}>
        <div style={{ display: 'flex', gap: 10, flex: 1 }}>
          <input
            style={{ ...styles.input, width: 220 }}
            placeholder="Buscar por nombre o serie..."
            value={filtro}
            onChange={e => { setFiltro(e.target.value); setPagina(1); }}
          />
          <select style={{ ...styles.input, width: 160 }} value={filtroTipo} onChange={e => { setFiltroTipo(e.target.value); setPagina(1); }}>
            <option value="">Todos los tipos</option>
            {TIPOS.map(t => <option key={t}>{t}</option>)}
          </select>
          <select style={{ ...styles.input, width: 160 }} value={filtroEstado} onChange={e => { setFiltroEstado(e.target.value); setPagina(1); }}>
            <option value="">Todos los estados</option>
            {ESTADOS.map(e => <option key={e}>{e}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
    {(filtro || filtroTipo || filtroEstado) && (
      <button style={styles.btn('ghost')} onClick={() => { setFiltro(''); setFiltroTipo(''); setFiltroEstado(''); setPagina(1); }}>
        ✕ Limpiar filtros
      </button>
    )}
    {rol === 'admin' && (
      <button style={styles.btn('primary')} onClick={abrirNuevo}>+ Nuevo Activo</button>
    )}
  </div>
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              {['Nombre', 'Tipo', 'Marca / Modelo', 'N° Serie', 'Estado', 'Asignado a', 'Acciones'].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activosPaginados.map(a => (
              <tr key={a.id}>
                <td style={styles.td}>{a.nombre}</td>
                <td style={{ ...styles.td, color: '#666' }}>{a.tipo}</td>
                <td style={{ ...styles.td, color: '#666' }}>{a.marca} {a.modelo}</td>
                <td style={{ ...styles.td, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#4fc3f7' }}>{a.serie}</td>
                <td style={styles.td}><span style={styles.badge(a.estado)}>{a.estado}</span></td>
                <td style={{ ...styles.td, color: a.asignado_a ? '#ddd' : '#444' }}>{a.asignado_a || '—'}</td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {rol === 'admin' ? (
                      <>
                        <button style={styles.btn('ghost')} onClick={() => setActivoSeleccionado(a.id)}>Ver</button>
                        <button style={styles.btn('ghost')}  onClick={() => abrirEditar(a)}>Editar</button>
                        <button style={styles.btn('danger')} onClick={() => eliminar(a.id)}>Eliminar</button>
                      </>
                    ) : (
                      <span style={{ fontSize: 11, color: '#444' }}>Solo lectura</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {activosPaginados.length === 0 && (
              <tr><td colSpan={7} style={{ ...styles.td, textAlign: 'center', color: '#444', padding: 32 }}>No se encontraron activos.</td></tr>
            )}
          </tbody>
        </table>

        {/*  Paginación */}
        {totalPaginas > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, padding: 16, borderTop: '1px solid #1a1a1a' }}>
            <button
              style={{ ...styles.btn('ghost'), opacity: pagina === 1 ? 0.4 : 1 }}
              onClick={() => setPagina(p => Math.max(1, p - 1))}
              disabled={pagina === 1}
            >← Anterior</button>
            <span style={{ color: '#888', fontSize: 12 }}>Página {pagina} de {totalPaginas}</span>
            <button
              style={{ ...styles.btn('ghost'), opacity: pagina === totalPaginas ? 0.4 : 1 }}
              onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
              disabled={pagina === totalPaginas}
            >Siguiente →</button>
          </div>
        )}
      </div>

      {modal && (
        <div style={styles.modal}>
          <div style={styles.modalBox}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 20 }}>
              {editId ? 'Editar Activo' : 'Nuevo Activo'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { label: 'Nombre del activo *', key: 'nombre', type: 'text' },
                { label: 'N° de Serie *',        key: 'serie',  type: 'text' },
                { label: 'Marca *',              key: 'marca',  type: 'text' },
                { label: 'Modelo *',             key: 'modelo', type: 'text' },
                { label: 'Fecha de ingreso *',   key: 'fecha',  type: 'date' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label style={styles.label}>{label}</label>
                  <input style={styles.input} type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label style={styles.label}>Tipo *</label>
                <select style={styles.input} value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
                  {TIPOS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={styles.label}>Estado *</label>
                <select style={styles.input} value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}>
                  {ESTADOS.map(e => <option key={e}>{e}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <button style={styles.btn('ghost')}   onClick={() => setModal(false)}>Cancelar</button>
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


