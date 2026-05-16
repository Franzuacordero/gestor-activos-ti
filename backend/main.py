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

# Crear tablas en la base de datos
models.Base.metadata.create_all(bind=engine)

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