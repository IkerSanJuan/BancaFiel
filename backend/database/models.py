from sqlalchemy import Column, Integer, String, Boolean, Numeric, Date, ForeignKey, Enum, DateTime
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func
import enum
import uuid

Base = declarative_base()

def generate_uuid():
    return str(uuid.uuid4())

class EstadoSolicitud(enum.Enum):
    PENDIENTE = "Pendiente"
    EN_REVISION = "En revisión"
    APROBADA = "Aprobada"
    RECHAZADA = "Rechazada"

class RecomendacionIA(enum.Enum):
    PRE_APROBADA = "Pre-aprobada"
    REVISION_MANUAL = "Revisión Manual"

class Solicitud(Base):
    __tablename__ = "solicitudes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    nombre = Column(String(200), nullable=False)
    producto_solicitado = Column(String(100), nullable=False)
    aceptacion_privacidad = Column(Boolean, nullable=False, default=True)
    autorizacion_buro = Column(Boolean, nullable=False, default=True)
    
    curp = Column(String(18), unique=True, nullable=False)
    fecha_nacimiento = Column(Date, nullable=False)
    nacionalidad = Column(String(100))
    estado_civil = Column(String(50))
    dependientes_economicos = Column(Integer)
    nivel_estudios = Column(String(100))
    
    tipo_empleo = Column(String(100))
    nombre_empresa = Column(String(255))
    antiguedad_laboral_meses = Column(Integer)
    ingreso_mensual_neto = Column(Numeric(12, 2))
    
    celular = Column(String(20))
    correo_electronico = Column(String(255))
    
    es_cliente_nuevo = Column(Boolean, default=True)
    monto_solicitado = Column(Numeric(12, 2), nullable=True)
    plazo_meses = Column(Integer, nullable=True)
    motivo_credito = Column(String(255), nullable=True)
    
    estado_proceso = Column(Enum(EstadoSolicitud), default=EstadoSolicitud.PENDIENTE)
    score_riesgo_ia = Column(Numeric(5, 2), nullable=True)
    recomendacion_ia = Column(Enum(RecomendacionIA), nullable=True)
    limite_credito = Column(Numeric(12, 2), nullable=True)
    
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())

    direccion = relationship("Direccion", back_populates="solicitud", uselist=False)
    documentos = relationship("Documentacion", back_populates="solicitud")

class Direccion(Base):
    __tablename__ = "direcciones"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    solicitud_id = Column(String(36), ForeignKey('solicitudes.id'), nullable=False)
    calle = Column(String(255))
    numero = Column(String(50))
    colonia = Column(String(150))
    codigo_postal = Column(String(10))
    ciudad_alcaldia = Column(String(150))
    estado = Column(String(100))

    solicitud = relationship("Solicitud", back_populates="direccion")

class TipoDocumento(enum.Enum):
    INE_FRONT = "INE_Front"
    INE_BACK = "INE_Back"
    COMPROBANTE_DOM = "Comprobante_Dom"
    COMPROBANTE_INGRESOS = "Comprobante_Ingresos"
    SELFIE = "Selfie"

class Documentacion(Base):
    __tablename__ = "documentacion"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    solicitud_id = Column(String(36), ForeignKey('solicitudes.id'), nullable=False)
    tipo_documento = Column(Enum(TipoDocumento), nullable=False)
    ruta_almacenamiento = Column(String(500), nullable=False)
    metadata_ocr_extraida = Column(String) # For SQLite/Prototype fallback to JSON string if JSONB not supported

    solicitud = relationship("Solicitud", back_populates="documentos")
