import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine
from models.models import Base, Activo, Historial, Usuario, Mantencion
from passlib.context import CryptContext
from datetime import date

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Crear tablas
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# ── USUARIOS ──────────────────────────────────────────
usuarios = [
    {"username": "admin", "password": "admin123", "rol": "admin"},
    {"username": "tecnico1", "password": "tecnico123", "rol": "tecnico"},
    {"username": "tecnico2", "password": "tecnico123", "rol": "tecnico"},
]

for u in usuarios:
    existe = db.query(Usuario).filter(Usuario.username == u["username"]).first()
    if not existe:
        nuevo = Usuario(username=u["username"], password=pwd_context.hash(u["password"]), rol=u["rol"])
        db.add(nuevo)

db.commit()

# ── ACTIVOS ───────────────────────────────────────────
activos = [
    {"nombre": "Notebook Dell Latitude 5520", "tipo": "Computador", "marca": "Dell", "modelo": "Latitude 5520", "serie": "DL-2024-001", "estado": "Operativo", "asignado_a": "Carlos Muñoz", "fecha": "2023-03-15"},
    {"nombre": "Notebook HP ProBook 450", "tipo": "Computador", "marca": "HP", "modelo": "ProBook 450 G8", "serie": "HP-2024-012", "estado": "Operativo", "asignado_a": None, "fecha": "2024-01-08"},
    {"nombre": "Notebook Lenovo ThinkPad", "tipo": "Computador", "marca": "Lenovo", "modelo": "ThinkPad E15", "serie": "LN-2023-033", "estado": "En reparacion", "asignado_a": None, "fecha": "2023-06-20"},
    {"nombre": "Monitor LG 24\"", "tipo": "Monitor", "marca": "LG", "modelo": "24MK600M", "serie": "LG-2023-045", "estado": "Operativo", "asignado_a": "Ana Torres", "fecha": "2023-05-20"},
    {"nombre": "Monitor Samsung 27\"", "tipo": "Monitor", "marca": "Samsung", "modelo": "S27F350", "serie": "SM-2024-007", "estado": "Operativo", "asignado_a": None, "fecha": "2024-02-14"},
    {"nombre": "Teclado Logitech K120", "tipo": "Periferico", "marca": "Logitech", "modelo": "K120", "serie": "LG-KB-0089", "estado": "En reparacion", "asignado_a": None, "fecha": "2022-11-10"},
    {"nombre": "Mouse Logitech M185", "tipo": "Periferico", "marca": "Logitech", "modelo": "M185", "serie": "LG-MS-0234", "estado": "Operativo", "asignado_a": "Carlos Muñoz", "fecha": "2023-03-15"},
    {"nombre": "Impresora HP LaserJet", "tipo": "Impresora", "marca": "HP", "modelo": "LaserJet Pro M404n", "serie": "HP-PR-2022-003", "estado": "Dado de baja", "asignado_a": None, "fecha": "2021-06-30"},
    {"nombre": "Switch Cisco 24 puertos", "tipo": "Red", "marca": "Cisco", "modelo": "SG110-24", "serie": "CS-SW-2023-001", "estado": "Operativo", "asignado_a": None, "fecha": "2023-01-10"},
    {"nombre": "UPS APC 1500VA", "tipo": "Otro", "marca": "APC", "modelo": "BX1500M", "serie": "APC-2022-045", "estado": "Operativo", "asignado_a": None, "fecha": "2022-08-05"},
]

activos_creados = []
for a in activos:
    existe = db.query(Activo).filter(Activo.serie == a["serie"]).first()
    if not existe:
        nuevo = Activo(**a)
        db.add(nuevo)
        db.flush()
        activos_creados.append(nuevo)

db.commit()

# ── HISTORIAL ─────────────────────────────────────────
if activos_creados:
    historiales = [
        {"activo_id": activos_creados[0].id, "tipo": "Asignacion", "descripcion": "Asignado a Carlos Muñoz para trabajo remoto", "fecha": "2024-01-10", "tecnico": "admin"},
        {"activo_id": activos_creados[2].id, "tipo": "Mantencion", "descripcion": "Pantalla con rayas horizontales. Enviado a reparacion.", "fecha": "2024-03-05", "tecnico": "tecnico1"},
        {"activo_id": activos_creados[3].id, "tipo": "Asignacion", "descripcion": "Asignado a Ana Torres en oficina principal", "fecha": "2023-05-21", "tecnico": "admin"},
        {"activo_id": activos_creados[5].id, "tipo": "Mantencion", "descripcion": "Tecla espacio atascada. En reparacion.", "fecha": "2024-02-15", "tecnico": "tecnico2"},
        {"activo_id": activos_creados[7].id, "tipo": "Baja", "descripcion": "Impresora fuera de servicio, sin repuestos disponibles.", "fecha": "2023-12-01", "tecnico": "admin"},
    ]
    for h in historiales:
        nuevo = Historial(**h)
        db.add(nuevo)

    # ── MANTENCIONES ──────────────────────────────────────
    mantenciones = [
        {"activo_id": activos_creados[2].id, "tipo": "Correctiva", "descripcion": "Pantalla con rayas horizontales", "tecnico": "tecnico1", "estado": "En proceso", "fecha": "2024-03-05"},
        {"activo_id": activos_creados[5].id, "tipo": "Correctiva", "descripcion": "Tecla espacio atascada", "tecnico": "tecnico2", "estado": "Pendiente", "fecha": "2024-02-15"},
        {"activo_id": activos_creados[0].id, "tipo": "Preventiva", "descripcion": "Limpieza general y actualizacion de drivers", "tecnico": "tecnico1", "estado": "Completada", "fecha": "2024-01-20"},
    ]
    for m in mantenciones:
        nuevo = Mantencion(**m)
        db.add(nuevo)

db.commit()
db.close()
print("Base de datos poblada exitosamente!")
print(f"Usuarios: admin/admin123, tecnico1/tecnico123, tecnico2/tecnico123")