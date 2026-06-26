from pydantic import BaseModel
from typing import Optional
from datetime import date

# ── ACTIVOS ──────────────────────────────────────────
class ActivoBase(BaseModel):
    nombre: str
    tipo: str
    marca: str
    modelo: str
    serie: str
    estado: str
    fecha: Optional[str] = None

class ActivoCreate(ActivoBase):
    pass

class ActivoUpdate(ActivoBase):
    asignado_a: Optional[str] = None

class ActivoResponse(ActivoBase):
    id: int
    asignado_a: Optional[str] = None
    foto_url: Optional[str] = None

    class Config:
        from_attributes = True

# ── HISTORIAL ─────────────────────────────────────────
class HistorialBase(BaseModel):
    activo_id: int
    tipo: str
    descripcion: str
    tecnico: str

class HistorialCreate(HistorialBase):
    pass

class HistorialResponse(HistorialBase):
    id: int
    fecha: str

    class Config:
        from_attributes = True

# ── USUARIOS ─────────────────────────────────────────
class UsuarioCreate(BaseModel):
    username: str
    password: str
    rol: str = "tecnico"

class UsuarioResponse(BaseModel):
    id: int
    username: str
    rol: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    rol: str

# ── MANTENCIONES ─────────────────────────────────────
class MantencionBase(BaseModel):
    activo_id: int
    tipo: str
    descripcion: str
    tecnico: str
    estado: str = "Pendiente"
    fecha: str
    fecha_fin: Optional[str] = None

class MantencionCreate(MantencionBase):
    pass

class MantencionUpdate(BaseModel):
    tipo: Optional[str] = None
    descripcion: Optional[str] = None
    tecnico: Optional[str] = None
    estado: Optional[str] = None
    fecha_fin: Optional[str] = None

class MantencionResponse(MantencionBase):
    id: int

    class Config:
        from_attributes = True

class CambiarPassword(BaseModel):
    password_actual: str
    nueva_password: str