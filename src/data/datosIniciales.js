export const activosIniciales = [
  { id: 1, nombre: 'Notebook Dell Latitude', tipo: 'Computador', marca: 'Dell', modelo: 'Latitude 5520', serie: 'DL-2024-001', estado: 'Operativo', asignadoA: 'Carlos Muñoz', fecha: '2023-03-15' },
  { id: 2, nombre: 'Monitor LG 24"', tipo: 'Monitor', marca: 'LG', modelo: '24MK600M', serie: 'LG-2023-045', estado: 'Operativo', asignadoA: 'Ana Torres', fecha: '2023-05-20' },
  { id: 3, nombre: 'Teclado Logitech K120', tipo: 'Periferico', marca: 'Logitech', modelo: 'K120', serie: 'LG-KB-0089', estado: 'En reparacion', asignadoA: null, fecha: '2022-11-10' },
  { id: 4, nombre: 'Notebook HP ProBook', tipo: 'Computador', marca: 'HP', modelo: 'ProBook 450 G8', serie: 'HP-2024-012', estado: 'Operativo', asignadoA: null, fecha: '2024-01-08' },
  { id: 5, nombre: 'Impresora HP LaserJet', tipo: 'Impresora', marca: 'HP', modelo: 'LaserJet Pro M404n', serie: 'HP-PR-2022-003', estado: 'Dado de baja', asignadoA: null, fecha: '2021-06-30' },
];

export const historialIniciales = [
  { id: 1, activoId: 1, tipo: 'Asignacion', descripcion: 'Asignado a Carlos Muñoz para trabajo remoto', fecha: '2024-01-10', tecnico: 'Admin' },
  { id: 2, activoId: 3, tipo: 'Mantencion', descripcion: 'Tecla espacio atascada. En reparacion.', fecha: '2024-03-05', tecnico: 'Luis Perez' },
  { id: 3, activoId: 2, tipo: 'Asignacion', descripcion: 'Asignado a Ana Torres en oficina principal', fecha: '2023-05-21', tecnico: 'Admin' },
];

export const TIPOS = ['Computador', 'Monitor', 'Periferico', 'Impresora', 'Servidor', 'Red', 'Otro'];
export const ESTADOS = ['Operativo', 'En reparacion', 'Dado de baja'];
