import os
from services.ocr_service import extract_text_from_image, extract_text_from_pdf

def run_ocr_test():
    print("Iniciando prueba de OCR local...")
    
    # Create dummy images if they don't exist
    test_dir = "test_docs"
    os.makedirs(test_dir, exist_ok=True)
    
    img_path = os.path.join(test_dir, "dummy_ine.png")
    
    if not os.path.exists(img_path):
        from PIL import Image, ImageDraw, ImageFont
        img = Image.new('RGB', (400, 200), color=(255, 255, 255))
        d = ImageDraw.Draw(img)
        d.text((10,10), "INSTITUTO NACIONAL ELECTORAL", fill=(0,0,0))
        d.text((10,50), "NOMBRE: JUAN PEREZ MARTINEZ", fill=(0,0,0))
        d.text((10,90), "DOMICILIO: AV REFORMA 123", fill=(0,0,0))
        d.text((10,130), "CURP: ABCD800101HXXXXX00", fill=(0,0,0))
        img.save(img_path)
        print(f"Imagen sintética creada en {img_path}")
        
    print(f"\nExtrayendo texto de {img_path}...")
    texto = extract_text_from_image(img_path)
    
    print("\n--- Resultado OCR ---")
    print(texto if texto else "No se pudo extraer texto. Revisa la instalación de Tesseract.")
    print("---------------------\n")

if __name__ == "__main__":
    run_ocr_test()
