from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date
from database.models import EstadoSolicitud, RecomendacionIA, TipoDocumento

# --- Schemas de Direccion ---
class DireccionBase(BaseModel):
    calle: str
    numero: str
    colonia: str
    codigo_postal: str
    ciudad_alcaldia: str
    estado: str

class DireccionCreate(DireccionBase):
    pass

class Direccion(DireccionBase):
    id: str
    solicitud_id: str

    class Config:
        from_attributes = True

# --- Schemas de Documentacion ---
class DocumentacionBase(BaseModel):
    tipo_documento: TipoDocumento
    ruta_almacenamiento: str
    metadata_ocr_extraida: Optional[str] = None

class DocumentacionCreate(DocumentacionBase):
    pass

class Documentacion(DocumentacionBase):
    id: str
    solicitud_id: str

    class Config:
        from_attributes = True

# --- Schemas de Solicitud ---
class SolicitudBase(BaseModel):
    nombres: str
    apellido_paterno: str
    apellido_materno: Optional[str] = None
    producto_solicitado: str
    aceptacion_privacidad: bool
    autorizacion_buro: bool
    curp: str = Field(..., max_length=18, min_length=18)
    fecha_nacimiento: date
    nacionalidad: str
    estado_civil: str
    dependientes_economicos: int = Field(ge=0)
    nivel_estudios: str
    tipo_empleo: str
    nombre_empresa: str
    antiguedad_laboral_meses: int = Field(ge=0)
    ingreso_mensual_neto: float = Field(ge=0)
    celular: str
    correo_electronico: EmailStr
    monto_solicitado: Optional[float] = None
    plazo_meses: Optional[int] = None
    motivo_credito: Optional[str] = None

class SolicitudCreate(SolicitudBase):
    direccion: DireccionCreate

class Solicitud(SolicitudBase):
    id: str
    es_cliente_nuevo: bool
    estado_proceso: EstadoSolicitud
    score_riesgo_ia: Optional[float] = None
    recomendacion_ia: Optional[RecomendacionIA] = None
    ia_razon_revision: Optional[str] = None
    limite_credito: Optional[float] = None
    direccion: Optional[Direccion] = None
    documentos: List[Documentacion] = []

    class Config:
        from_attributes = True
