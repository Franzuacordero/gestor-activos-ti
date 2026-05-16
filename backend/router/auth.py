from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
from models import models
from schemas import UsuarioCreate, UsuarioResponse, Token
from auth import hashear_password, verificar_password, crear_token

router = APIRouter(prefix="/auth", tags=["Autenticacion"])

# ── REGISTRO ──────────────────────────────────────────
@router.post("/registro", response_model=UsuarioResponse)
def registro(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    existe = db.query(models.Usuario).filter(models.Usuario.username == usuario.username).first()
    if existe:
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    nuevo = models.Usuario(
        username=usuario.username,
        password=hashear_password(usuario.password),
        rol=usuario.rol
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

# ── LOGIN ─────────────────────────────────────────────
@router.post("/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.username == form.username).first()
    if not usuario or not verificar_password(form.password, usuario.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos"
        )
    token = crear_token({"sub": usuario.username, "rol": usuario.rol})
    return {"access_token": token, "token_type": "bearer", "rol": usuario.rol}