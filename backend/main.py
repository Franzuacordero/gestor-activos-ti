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
from sqlalchemy.orm import Session
from passlib.context import CryptContext

# Crear tablas en la base de datos
models.Base.metadata.create_all(bind=engine)

# Poblar base de datos inicial si está vacía
def seed_inicial():
    pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
    db = Session(bind=engine)
    try:
        from models.models import Usuario
        if not db.query(Usuario).first():
            usuarios = [
                Usuario(username="admin", password=pwd.hash("admin123"), rol="admin"),
                Usuario(username="tecnico1", password=pwd.hash("tecnico123"), rol="tecnico"),
            ]
            for u in usuarios:
                db.add(u)
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
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers
app.include_router(auth_router.router)
app.include_router(activos_router.router)
app.include_router(mantenciones_router.router)

@app.get("/")
def root():
    return {"message": "API Gestor de Activos TI - SoporteTech Ltda."}