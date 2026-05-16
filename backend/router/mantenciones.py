from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import models
from schemas import MantencionCreate, MantencionUpdate, MantencionResponse
from auth import get_usuario_actual
from datetime import date
from typing import List

router = APIRouter(prefix="/mantenciones", tags=["Mantenciones"])

# ── OBTENER TODAS ─────────────────────────────────────
@router.get("/", response_model=List[MantencionResponse])
def get_mantenciones(db: Session = Depends(get_db), usuario=Depends(get_usuario_actual)):
    return db.query(models.Mantencion).all()

# ── OBTENER POR ACTIVO ────────────────────────────────
@router.get("/activo/{activo_id}", response_model=List[MantencionResponse])
def get_mantenciones_activo(activo_id: int, db: Session = Depends(get_db), usuario=Depends(get_usuario_actual)):
    return db.query(models.Mantencion).filter(models.Mantencion.activo_id == activo_id).all()

# ── CREAR ─────────────────────────────────────────────
@router.post("/", response_model=MantencionResponse)
def crear_mantencion(mantencion: MantencionCreate, db: Session = Depends(get_db), usuario=Depends(get_usuario_actual)):
    nueva = models.Mantencion(**mantencion.dict())
    db.add(nueva)
    # Actualizar estado del activo
    activo = db.query(models.Activo).filter(models.Activo.id == mantencion.activo_id).first()
    if activo and mantencion.estado == "En proceso":
        activo.estado = "En reparacion"
    # Registrar en historial
    historial = models.Historial(
        activo_id=mantencion.activo_id, tipo="Mantencion",
        descripcion=f"Mantencion {mantencion.tipo}: {mantencion.descripcion}",
        fecha=str(date.today()), tecnico=usuario.username
    )
    db.add(historial)
    db.commit()
    db.refresh(nueva)
    return nueva

# ── ACTUALIZAR ────────────────────────────────────────
@router.put("/{id}", response_model=MantencionResponse)
def actualizar_mantencion(id: int, mantencion: MantencionUpdate, db: Session = Depends(get_db), usuario=Depends(get_usuario_actual)):
    db_mantencion = db.query(models.Mantencion).filter(models.Mantencion.id == id).first()
    if not db_mantencion:
        raise HTTPException(status_code=404, detail="Mantencion no encontrada")
    for key, value in mantencion.dict(exclude_none=True).items():
        setattr(db_mantencion, key, value)
    # Si se completa la mantención actualizar estado del activo
    if mantencion.estado == "Completada":
        activo = db.query(models.Activo).filter(models.Activo.id == db_mantencion.activo_id).first()
        if activo:
            activo.estado = "Operativo"
    db.commit()
    db.refresh(db_mantencion)
    return db_mantencion

# ── ELIMINAR ──────────────────────────────────────────
@router.delete("/{id}")
def eliminar_mantencion(id: int, db: Session = Depends(get_db), usuario=Depends(get_usuario_actual)):
    mantencion = db.query(models.Mantencion).filter(models.Mantencion.id == id).first()
    if not mantencion:
        raise HTTPException(status_code=404, detail="Mantencion no encontrada")
    db.delete(mantencion)
    db.commit()
    return {"message": "Mantencion eliminada correctamente"}