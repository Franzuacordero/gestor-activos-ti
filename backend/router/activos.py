from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import models
from schemas import ActivoCreate, ActivoUpdate, ActivoResponse, HistorialCreate, HistorialResponse
from auth import get_usuario_actual
from datetime import date
from typing import List
from datetime import datetime, timedelta


router = APIRouter(prefix="/activos", tags=["Activos"])

# ── OBTENER TODOS ─────────────────────────────────────
@router.get("/", response_model=List[ActivoResponse])
def get_activos(db: Session = Depends(get_db), usuario=Depends(get_usuario_actual)):
    return db.query(models.Activo).all()

# ── OBTENER UNO ───────────────────────────────────────
@router.get("/{id}", response_model=ActivoResponse)
def get_activo(id: int, db: Session = Depends(get_db), usuario=Depends(get_usuario_actual)):
    activo = db.query(models.Activo).filter(models.Activo.id == id).first()
    if not activo:
        raise HTTPException(status_code=404, detail="Activo no encontrado")
    return activo

# ── CREAR ─────────────────────────────────────────────
@router.post("/", response_model=ActivoResponse)
def crear_activo(activo: ActivoCreate, db: Session = Depends(get_db), usuario=Depends(get_usuario_actual)):
    existe = db.query(models.Activo).filter(models.Activo.serie == activo.serie).first()
    if existe:
        raise HTTPException(status_code=400, detail="Ya existe un activo con ese numero de serie")
    nuevo = models.Activo(**activo.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    # registrar en historial
    historial = models.Historial(
        activo_id=nuevo.id, tipo="Registro",
        descripcion=f"Activo registrado: {nuevo.nombre}",
        fecha=str(date.today()), tecnico=usuario.username
    )
    db.add(historial)
    db.commit()
    return nuevo

# ── ACTUALIZAR ────────────────────────────────────────
@router.put("/{id}", response_model=ActivoResponse)
def actualizar_activo(id: int, activo: ActivoUpdate, db: Session = Depends(get_db), usuario=Depends(get_usuario_actual)):
    db_activo = db.query(models.Activo).filter(models.Activo.id == id).first()
    if not db_activo:
        raise HTTPException(status_code=404, detail="Activo no encontrado")
    for key, value in activo.dict().items():
        setattr(db_activo, key, value)
    db.commit()
    db.refresh(db_activo)
    return db_activo

# ── ASIGNAR ───────────────────────────────────────────
@router.patch("/{id}/asignar")
def asignar_activo(id: int, persona: str, descripcion: str = "", db: Session = Depends(get_db), usuario=Depends(get_usuario_actual)):
    activo = db.query(models.Activo).filter(models.Activo.id == id).first()
    if not activo:
        raise HTTPException(status_code=404, detail="Activo no encontrado")
    activo.asignado_a = persona
    historial = models.Historial(
        activo_id=id, tipo="Asignacion",
        descripcion=descripcion or f"Asignado a {persona}",
        fecha=str(date.today()), tecnico=usuario.username
    )
    db.add(historial)
    db.commit()
    return {"message": "Activo asignado correctamente"}

# ── DESASIGNAR ────────────────────────────────────────
@router.patch("/{id}/desasignar")
def desasignar_activo(id: int, db: Session = Depends(get_db), usuario=Depends(get_usuario_actual)):
    activo = db.query(models.Activo).filter(models.Activo.id == id).first()
    if not activo:
        raise HTTPException(status_code=404, detail="Activo no encontrado")
    historial = models.Historial(
        activo_id=id, tipo="Desasignacion",
        descripcion=f"Desasignado de {activo.asignado_a}",
        fecha=str(date.today()), tecnico=usuario.username
    )
    activo.asignado_a = None
    db.add(historial)
    db.commit()
    return {"message": "Activo desasignado correctamente"}

# ── ELIMINAR ──────────────────────────────────────────
@router.delete("/{id}")
def eliminar_activo(id: int, db: Session = Depends(get_db), usuario=Depends(get_usuario_actual)):
    activo = db.query(models.Activo).filter(models.Activo.id == id).first()
    if not activo:
        raise HTTPException(status_code=404, detail="Activo no encontrado")
    db.delete(activo)
    db.commit()
    return {"message": "Activo eliminado correctamente"}

# ── HISTORIAL ─────────────────────────────────────────
@router.get("/{id}/historial", response_model=List[HistorialResponse])
def get_historial(id: int, db: Session = Depends(get_db), usuario=Depends(get_usuario_actual)):
    return db.query(models.Historial).filter(models.Historial.activo_id == id).all()

@router.get("/historial/todos", response_model=List[HistorialResponse])
def get_historial_todos(db: Session = Depends(get_db), usuario=Depends(get_usuario_actual)):
    return db.query(models.Historial).all()

@router.get("/{id}/detalle")
def get_detalle_activo(id: int, db: Session = Depends(get_db), usuario=Depends(get_usuario_actual)):
    activo = db.query(models.Activo).filter(models.Activo.id == id).first()
    if not activo:
        raise HTTPException(status_code=404, detail="Activo no encontrado")
    historial = db.query(models.Historial).filter(models.Historial.activo_id == id).all()
    mantenciones = db.query(models.Mantencion).filter(models.Mantencion.activo_id == id).all()
    return {
        "activo": activo,
        "historial": historial,
        "mantenciones": mantenciones
    }

@router.get("/notificaciones/alertas")
def get_notificaciones(db: Session = Depends(get_db), usuario=Depends(get_usuario_actual)):
    activos = db.query(models.Activo).filter(models.Activo.estado == "En reparacion").all()
    alertas = []
    hoy = datetime.now().date()
    for activo in activos:
        if activo.fecha:
            fecha_ingreso = datetime.strptime(activo.fecha, "%Y-%m-%d").date()
            dias = (hoy - fecha_ingreso).days
            if dias > 7:
                alertas.append({
                    "id": activo.id,
                    "nombre": activo.nombre,
                    "serie": activo.serie,
                    "dias_en_reparacion": dias,
                    "fecha": activo.fecha
                })
    return alertas