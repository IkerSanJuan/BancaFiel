# BancaFiel - Prototipo de Evaluación Crediticia con IA

BancaFiel es un prototipo funcional diseñado para automatizar y optimizar el proceso de originación de crédito (Tarjetas de Crédito y Préstamos Personales). El sistema reduce el tiempo de respuesta de semanas a menos de 45 segundos utilizando Inteligencia Artificial para la evaluación de riesgo y simulación de OCR para la lectura de documentos.

## 🚀 Características Principales

- **Módulo de Tarjetas de Crédito**: Asignación dinámica de tarjetas (Básica u Oro) y límites de crédito basados en el nivel de ingresos del cliente y su calificación de riesgo.
- **Módulo de Préstamos Personales**: Solicitudes de crédito flexibles donde el cliente especifica el monto, plazo y motivo, sujeto a aprobación inteligente.
- **Evaluación de Riesgo con IA**: Integración de un modelo predictivo (Scikit-learn) que evalúa en tiempo real métricas como ingresos, edad, antigüedad laboral y dependientes económicos para emitir una pre-aprobación o enviar a revisión manual.
- **Identificación Inteligente de Clientes**: Validación automática mediante CURP para detectar si el solicitante es un cliente "NUEVO" o "EXISTENTE".
- **Panel de control (Dashboard)**: Interfaz administrativa para visualizar el flujo de solicitudes, scores de riesgo, montos pre-aprobados y estatus operativos.

## 🛠️ Stack Tecnológico

**Frontend:**
- [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- [React Router DOM](https://reactrouter.com/) para la navegación
- [Lucide React](https://lucide.dev/) para iconografía
- CSS Vainilla y diseño Glassmorphism

**Backend:**
- [Python 3](https://www.python.org/)
- [FastAPI](https://fastapi.tiangolo.com/) para una API REST rápida y moderna
- [SQLAlchemy](https://www.sqlalchemy.org/) como ORM conectado a una base de datos local SQLite
- [Scikit-learn](https://scikit-learn.org/) para el modelo de Machine Learning
- [Pydantic](https://docs.pydantic.dev/) para la validación de datos

## 💻 Instalación y Ejecución Local

Para correr este proyecto en tu entorno local, asegúrate de tener instalados **Node.js** y **Python 3**.

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/BancaFiel.git
cd BancaFiel
```

### 2. Configurar el Backend (FastAPI)
Abre una terminal y navega a la carpeta del backend:
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # En Windows
pip install -r requirements.txt
python main.py
```
*La API estará disponible en `http://localhost:8000`. Puedes ver la documentación interactiva en `http://localhost:8000/docs`.*

### 3. Configurar el Frontend (React)
Abre otra terminal y navega a la carpeta del frontend:
```bash
cd frontend
npm install
npm run dev
```
*La aplicación web estará disponible en `http://localhost:5173`.*

### 4. Ejecución Todo-en-uno (Solo Windows)
Si estás en Windows, puedes utilizar el script proporcionado en la raíz del proyecto para levantar ambos servicios con un solo clic:
```powershell
.\run.ps1
```

## 🧠 Estructura del proyecto
- `/backend`: Lógica de la API, modelos de base de datos (`models.py`), esquemas de validación (`schemas.py`), endpoints (`main.py`) y motor de IA (`services/ml_prediction.py`).
- `/frontend`: Aplicación web interactiva. Destacan `Wizard.jsx` (Flujo de Tarjetas), `CreditWizard.jsx` (Flujo de Préstamos) y `Dashboard.jsx` (Panel Administrativo).

---
*Desarrollado como solución al caso de negocio de modernización bancaria de BancaFiel.*
