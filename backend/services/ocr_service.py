import pytesseract
from PIL import Image
from pdf2image import convert_from_path
import os

# Set tesseract path for Windows
# The user was instructed to install Tesseract-OCR to the default location.
# Fallback to default possible locations.
posibles_rutas = [
    r"C:\Program Files\Tesseract-OCR\tesseract.exe",
    r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
    r"C:\Tools\Tesseract-OCR\tesseract.exe"
]

for ruta in posibles_rutas:
    if os.path.exists(ruta):
        pytesseract.pytesseract.tesseract_cmd = ruta
        break

def extract_text_from_image(image_path: str) -> str:
    """Extrae texto de una imagen usando Tesseract OCR"""
    try:
        if not os.path.exists(image_path):
            return ""
        
        imagen = Image.open(image_path)
        texto = pytesseract.image_to_string(imagen) # Utiliza idioma default (eng)
        return texto
    except Exception as e:
        print(f"Error en OCR de imagen: {e}")
        return ""

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extrae texto de un documento PDF convirtiéndolo a imágenes primero."""
    extracted_text = ""
    try:
        # Require poppler-windows en el PATH para pdf2image, para el prototipo si falla poppler 
        # sugerimos a futuro PyMuPDF que no requiere poppler. 
        # Para el scope de este prototipo rápido, si poppler no está disponible, atraparemos la exepción.
        images = convert_from_path(pdf_path)
        for i, image in enumerate(images):
            text = pytesseract.image_to_string(image)
            extracted_text += f"--- Page {i+1} ---\n{text}\n"
        return extracted_text
    except Exception as e:
        print(f"Error extrayendo PDF (Asegúrate de tener Poppler instalado): {e}")
        return ""
