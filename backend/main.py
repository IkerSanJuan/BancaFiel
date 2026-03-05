import json
import os
import shutil
from fastapi import FastAPI, Depends, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database.database import engine, get_db
from database.models import Base, Solicitud, Direccion, Documentacion, TipoDocumento, EstadoSolicitud, RecomendacionIA
from schemas import Solicitud as SolicitudSchema, DireccionCreate, SolicitudCreate
from services.ocr_service import extract_text_from_image, extract_text_from_pdf
from services.ml_prediction import predecir_riesgo

Base.metadata.create_all(bind=engine)

app = FastAPI(title="BancaFiel API Prototipo", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/solicitudes")
async def create_solicitud(
    solicitud_data: str = Form(...), # JSON object as string for multipart/form-data
    ine_front: UploadFile = File(None),
    ine_back: UploadFile = File(None),
    comprobante_dom: UploadFile = File(None),
    comprobante_ingresos: UploadFile = File(None),
    selfie: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    try:
        data_dict = json.loads(solicitud_data)
        solicitud_schema = SolicitudCreate(**data_dict)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing JSON data: {str(e)}")

    try:
        # Check if customer already exists by CURP
        cliente_existente = db.query(Solicitud).filter(Solicitud.curp == solicitud_schema.curp).first()
        es_nuevo = False if cliente_existente else True

        # 1. Parse and Save Basic info
        db_solicitud = Solicitud(
            nombres=solicitud_schema.nombres,
            apellido_paterno=solicitud_schema.apellido_paterno,
            apellido_materno=solicitud_schema.apellido_materno,
            producto_solicitado=solicitud_schema.producto_solicitado,
            es_cliente_nuevo=es_nuevo,
            monto_solicitado=solicitud_schema.monto_solicitado,
            plazo_meses=solicitud_schema.plazo_meses,
            motivo_credito=solicitud_schema.motivo_credito,
            aceptacion_privacidad=solicitud_schema.aceptacion_privacidad,
            autorizacion_buro=solicitud_schema.autorizacion_buro,
            curp=solicitud_schema.curp,
            fecha_nacimiento=solicitud_schema.fecha_nacimiento,
            nacionalidad=solicitud_schema.nacionalidad,
            estado_civil=solicitud_schema.estado_civil,
            dependientes_economicos=solicitud_schema.dependientes_economicos,
            nivel_estudios=solicitud_schema.nivel_estudios,
            tipo_empleo=solicitud_schema.tipo_empleo,
            nombre_empresa=solicitud_schema.nombre_empresa,
            antiguedad_laboral_meses=solicitud_schema.antiguedad_laboral_meses,
            ingreso_mensual_neto=solicitud_schema.ingreso_mensual_neto,
            celular=solicitud_schema.celular,
            correo_electronico=solicitud_schema.correo_electronico,
        )
        db.add(db_solicitud)
        db.commit()
        db.refresh(db_solicitud)

        # 1.1 Save Direccion
        db_direccion = Direccion(
            **solicitud_schema.direccion.model_dump(),
            solicitud_id=db_solicitud.id
        )
        db.add(db_direccion)
        db.commit()

        # 2. Save Uploaded Files and Extract OCR
        files_map = {
            TipoDocumento.INE_FRONT: ine_front,
            TipoDocumento.INE_BACK: ine_back,
            TipoDocumento.COMPROBANTE_DOM: comprobante_dom,
            TipoDocumento.COMPROBANTE_INGRESOS: comprobante_ingresos,
            TipoDocumento.SELFIE: selfie
        }

        for tipo, file_obj in files_map.items():
            if file_obj:
                filepath = os.path.join(UPLOAD_DIR, f"{db_solicitud.id}_{tipo.value}_{file_obj.filename}")
                with open(filepath, "wb") as buffer:
                    shutil.copyfileobj(file_obj.file, buffer)
                
                # OCR Extraction Simulation (Local)
                ocr_text = ""
                if filepath.lower().endswith(".pdf"):
                    ocr_text = extract_text_from_pdf(filepath)
                else:
                    ocr_text = extract_text_from_image(filepath)

                db_doc = Documentacion(
                    solicitud_id=db_solicitud.id,
                    tipo_documento=tipo,
                    ruta_almacenamiento=filepath,
                    metadata_ocr_extraida=ocr_text[:500] if ocr_text else "" # Limiting size for prototype
                )
                db.add(db_doc)

        # 3. Predict AI Risk
        # Calculate age
        from datetime import date
        today = date.today()
        bday = db_solicitud.fecha_nacimiento
        edad_anios = today.year - bday.year - ((today.month, today.day) < (bday.month, bday.day))

        score, recomendacion, razon_ia = predecir_riesgo(
            ingreso_neto=float(db_solicitud.ingreso_mensual_neto),
            antiguedad_meses=db_solicitud.antiguedad_laboral_meses,
            edad_anios=edad_anios,
            num_dependientes=db_solicitud.dependientes_economicos
        )

        # Capa de Defensa: Hard Rules
        if recomendacion == RecomendacionIA.PRE_APROBADA:
            if edad_anios < 21 or edad_anios > 70:
                recomendacion = RecomendacionIA.REVISION_MANUAL
                razon_ia = f"Regla de Negocio: Edad de Alto Riesgo ({edad_anios} años)"
            elif db_solicitud.antiguedad_laboral_meses < 6:
                recomendacion = RecomendacionIA.REVISION_MANUAL
                razon_ia = f"Regla de Negocio: Antigüedad Laboral insuficiente ({db_solicitud.antiguedad_laboral_meses} meses)"
            elif db_solicitud.ingreso_mensual_neto < 10000:
                recomendacion = RecomendacionIA.REVISION_MANUAL
                razon_ia = f"Regla de Negocio: Ingreso Mensual Neto debajo del mínimo operativo (${db_solicitud.ingreso_mensual_neto})"

        db_solicitud.score_riesgo_ia = score
        db_solicitud.recomendacion_ia = recomendacion
        db_solicitud.ia_razon_revision = razon_ia
        
        # Logic to dynamically assign credit card type and limit
        if recomendacion == RecomendacionIA.PRE_APROBADA:
            if db_solicitud.producto_solicitado == "Préstamo Personal":
                db_solicitud.limite_credito = db_solicitud.monto_solicitado # Aprueba lo solicitado si pasa la IA
            else:
                # Lógica estricta de Tarjeta de Crédito (Reducción de Límites Originales)
                ingreso = float(db_solicitud.ingreso_mensual_neto)
                if ingreso >= 20000:
                    db_solicitud.producto_solicitado = "Tarjeta de Crédito Oro"
                    db_solicitud.limite_credito = ingreso * 1.0  # Conservador: 1.0x (vs 1.5x)
                else:
                    db_solicitud.producto_solicitado = "Tarjeta de Crédito Básica"
                    db_solicitud.limite_credito = ingreso * 0.8  # Conservador: 0.8x (vs 1.0x)

        db.commit()
        db.refresh(db_solicitud)
    except Exception as final_e:
        import traceback
        with open("crash_log.txt", "w") as f:
            f.write(traceback.format_exc())
        raise final_e

    return {
        "message": "Solicitud procesada exitosamente", 
        "id": db_solicitud.id, 
        "recomendacion": recomendacion.value,
        "producto_asignado": db_solicitud.producto_solicitado,
        "limite_asignado": float(db_solicitud.limite_credito) if db_solicitud.limite_credito else None
    }

@app.get("/api/solicitudes", response_model=List[SolicitudSchema])
def get_solicitudes(db: Session = Depends(get_db)):
    # Returns the list ordered from newest to oldest
    solicitudes = db.query(Solicitud).order_by(Solicitud.fecha_creacion.desc()).all()
    return solicitudes

from pydantic import BaseModel
class EstadoUpdate(BaseModel):
    estado: str

@app.put("/api/solicitudes/{sol_id}/estado")
def update_solicitud_estado(sol_id: str, payload: EstadoUpdate, db: Session = Depends(get_db)):
    solicitud = db.query(Solicitud).filter(Solicitud.id == sol_id).first()
    if not solicitud:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")
    
    nuevo_estado = payload.estado
    if nuevo_estado == "APROBADA":
        solicitud.estado_proceso = EstadoSolicitud.APROBADA
    elif nuevo_estado == "RECHAZADA":
        solicitud.estado_proceso = EstadoSolicitud.RECHAZADA
    else:
        raise HTTPException(status_code=400, detail="Estado invalido")

    db.commit()
    db.refresh(solicitud)
    return {"message": f"Estado actualizado a {nuevo_estado}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
