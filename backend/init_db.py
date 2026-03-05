from database.database import engine
from database.models import Base

print("Creando tablas de Base de Datos (SQLite) para el Prototipo BancaFiel...")
Base.metadata.create_all(bind=engine)
print("¡Tablas creadas exitosamente en bancafiel.db!")
