from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Use SQLite for the local prototype to avoid complex Postgres setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./bancafiel.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
