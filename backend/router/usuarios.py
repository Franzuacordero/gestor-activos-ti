from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import models
from schemas import UsuarioCreate, UsuarioResponse
from auth import hashear_password, get_usuario_actual

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

# ── OBTENER TODOS ─────────────────────────────────────
@router.get("/", response_model=list[UsuarioResponse])
def get_usuarios(db: Session = Depends(get_db), usuario=Depends(get_usuario_actual)):
    if usuario.rol != "admin":
        raise HTTPException(status_code=403, detail="Solo administradores pueden ver usuarios")
    return db.query(models.Usuario).all()

# ── CREAR ─────────────────────────────────────────────
@router.post("/", response_model=UsuarioResponse)
def crear_usuario(datos: UsuarioCreate, db: Session = Depends(get_db), usuario=Depends(get_usuario_actual)):
    if usuario.rol != "admin":
        raise HTTPException(status_code=403, detail="Solo administradores pueden crear usuarios")
    existe = db.query(models.Usuario).filter(models.Usuario.username == datos.username).first()
    if existe:
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    nuevo = models.Usuario(
        username=datos.username,
        password=hashear_password(datos.password),
        rol=datos.rol
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

# ── ELIMINAR ──────────────────────────────────────────
@router.delete("/{id}")
def eliminar_usuario(id: int, db: Session = Depends(get_db), usuario=Depends(get_usuario_actual)):
    if usuario.rol != "admin":
        raise HTTPException(status_code=403, detail="Solo administradores pueden eliminar usuarios")
    if usuario.id == id:
        raise HTTPException(status_code=400, detail="No puedes eliminar tu propio usuario")
    u = db.query(models.Usuario).filter(models.Usuario.id == id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    db.delete(u)
    db.commit()
    return {"message": "Usuario eliminado correctamente"}