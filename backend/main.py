import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models import models
from router import activos as activos_router
from router import auth as auth_router
from router import mantenciones as mantenciones_router
from router import usuarios as usuarios_router
from sqlalchemy.orm import Session
from passlib.context import CryptContext

# Crear tablas en la base de datos
models.Base.metadata.create_all(bind=engine)

# Poblar base de datos inicial si está vacía
def seed_inicial():
    pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
    db = Session(bind=engine)
    try:
        from models.models import Usuario, Activo
        if not db.query(Usuario).first():
            usuarios = [
                Usuario(username="admin", password=pwd.hash("admin123"), rol="admin"),
                Usuario(username="tecnico1", password=pwd.hash("tecnico123"), rol="tecnico"),
                Usuario(username="tecnico2", password=pwd.hash("tecnico123"), rol="tecnico"),
            ]
            for u in usuarios:
                db.add(u)
            db.commit()

        if not db.query(Activo).first():
            activos = [
                Activo(nombre="Notebook Dell Latitude 5520", tipo="Computador", marca="Dell", modelo="Latitude 5520", serie="DL-2024-001", estado="Operativo", asignado_a="Carlos Muñoz", fecha="2023-03-15"),
                Activo(nombre="Notebook HP ProBook 450", tipo="Computador", marca="HP", modelo="ProBook 450 G8", serie="HP-2024-012", estado="Operativo", asignado_a=None, fecha="2024-01-08"),
                Activo(nombre="Notebook Lenovo ThinkPad", tipo="Computador", marca="Lenovo", modelo="ThinkPad E15", serie="LN-2023-033", estado="En reparacion", asignado_a=None, fecha="2023-06-20"),
                Activo(nombre="Monitor LG 24\"", tipo="Monitor", marca="LG", modelo="24MK600M", serie="LG-2023-045", estado="Operativo", asignado_a="Ana Torres", fecha="2023-05-20"),
                Activo(nombre="Monitor Samsung 27\"", tipo="Monitor", marca="Samsung", modelo="S27F350", serie="SM-2024-007", estado="Operativo", asignado_a=None, fecha="2024-02-14"),
                Activo(nombre="Teclado Logitech K120", tipo="Periferico", marca="Logitech", modelo="K120", serie="LG-KB-0089", estado="En reparacion", asignado_a=None, fecha="2022-11-10"),
                Activo(nombre="Mouse Logitech M185", tipo="Periferico", marca="Logitech", modelo="M185", serie="LG-MS-0234", estado="Operativo", asignado_a="Carlos Muñoz", fecha="2023-03-15"),
                Activo(nombre="Impresora HP LaserJet", tipo="Impresora", marca="HP", modelo="LaserJet Pro M404n", serie="HP-PR-2022-003", estado="Dado de baja", asignado_a=None, fecha="2021-06-30"),
                Activo(nombre="Switch Cisco 24 puertos", tipo="Red", marca="Cisco", modelo="SG110-24", serie="CS-SW-2023-001", estado="Operativo", asignado_a=None, fecha="2023-01-10"),
                Activo(nombre="UPS APC 1500VA", tipo="Otro", marca="APC", modelo="BX1500M", serie="APC-2022-045", estado="Operativo", asignado_a=None, fecha="2022-08-05"),
            ]
            for a in activos:
                db.add(a)
            db.commit()
    finally:
        db.close()

seed_inicial()

app = FastAPI(
    title="Gestor de Activos TI - SoporteTech",
    description="API REST para gestion de activos tecnologicos",
    version="1.0.0"
)

# Permitir conexion desde React
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://gestor-activos-frontend.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers
app.include_router(auth_router.router)
app.include_router(activos_router.router)
app.include_router(mantenciones_router.router)
app.include_router(usuarios_router.router)

@app.get("/")
def root():
    return {"message": "API Gestor de Activos TI - SoporteTech Ltda."}