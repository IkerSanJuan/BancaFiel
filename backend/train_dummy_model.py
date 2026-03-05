import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

print("Entrenando modelo sintético de prueba para BancaFiel...")

# Generaremos datos sintéticos muy simples para el prototipo
# Features: [ingreso_neto, antiguedad_meses, edad, num_dependientes]
# Target: 1 (Alto Riesgo / Default), 0 (Buen pagador)
X_train = np.array([
    [25000, 36, 30, 0], # Bueno
    [8000,  3,  22, 2], # Malo
    [50000, 120, 45, 2], # Bueno
    [12000, 6,  25, 1], # Limite superior malo
    [35000, 60, 35, 3], # Bueno
    [5000,  1,  18, 0], # Malo
])

y_train = np.array([0, 1, 0, 1, 0, 1])

# Entrenar un Random Forest
clf = RandomForestClassifier(n_estimators=10, random_state=42)
clf.fit(X_train, y_train)

# Guardar el modelo entrenado
model_path = os.path.join(os.path.dirname(__file__), "services", "risk_model.pkl")
joblib.dump(clf, model_path)

print(f"Modelo Scikit-Learn guardado exitosamente en: {model_path}")
print("Prueba de Inferencia Local:")
print("Solicitante A (25k ingreso, 36 meses, 30 años, 0 dep):", "Riesgo" if clf.predict([[25000, 36, 30, 0]])[0] == 1 else "Pre-Aprobada")
print("Solicitante B (8k ingreso, 3 meses, 22 años, 2 dep):", "Riesgo" if clf.predict([[8000, 3, 22, 2]])[0] == 1 else "Pre-Aprobada")
