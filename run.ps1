# Script para iniciar el Frontend (React) y Backend (FastAPI) simultáneamente

Write-Host "Iniciando Backend (FastAPI)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\python.exe main.py" -WindowStyle Normal

Write-Host "Iniciando Frontend (React/Vite)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -WindowStyle Normal

Write-Host "¡Ambos servicios se están iniciando en ventanas separadas!" -ForegroundColor Yellow
Write-Host "Accede a la Web App en tu navegador: http://localhost:5173" -ForegroundColor White
Write-Host "Accede a la API en: http://localhost:8000/docs" -ForegroundColor White
