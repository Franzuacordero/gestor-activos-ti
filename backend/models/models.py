from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base

class Activo(Base):
    __tablename__ = "activos"

    id          = Column(Integer, primary_key=True, index=True)
    nombre      = Column(String, nullable=False)
    tipo        = Column(String, nullable=False)
    marca       = Column(String, default="")
    modelo      = Column(String, default="")
    serie       = Column(String, nullable=False, unique=True)
    estado      = Column(String, default="Operativo")
    asignado_a  = Column(String, nullable=True)
    fecha       = Column(String, nullable=True)

class Historial(Base):
    __tablename__ = "historial"

    id          = Column(Integer, primary_key=True, index=True)
    activo_id   = Column(Integer, nullable=False)
    tipo        = Column(String, nullable=False)
    descripcion = Column(String, nullable=False)
    fecha       = Column(String, nullable=False)
    tecnico     = Column(String, default="Admin")

class Usuario(Base):
    __tablename__ = "usuarios"

    id          = Column(Integer, primary_key=True, index=True)
    username    = Column(String, unique=True, nullable=False)
    password    = Column(String, nullable=False)
    rol         = Column(String, default="tecnico")  # admin o tecnico

class Mantencion(Base):
    __tablename__ = "mantenciones"

    id          = Column(Integer, primary_key=True, index=True)
    activo_id   = Column(Integer, nullable=False)
    tipo        = Column(String, nullable=False)  # Preventiva, Correctiva, Predictiva
    descripcion = Column(String, nullable=False)
    tecnico     = Column(String, nullable=False)
    estado      = Column(String, default="Pendiente")  # Pendiente, En proceso, Completada
    fecha       = Column(String, nullable=False)
    fecha_fin   = Column(String, nullable=True)