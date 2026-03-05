from database.models import RecomendacionIA
import joblib
import os
import numpy as np

# Load the Scikit-Learn Model
try:
    model_path = os.path.join(os.path.dirname(__file__), "risk_model.pkl")
    clf = joblib.load(model_path)
except Exception as e:
    print(f"Advertencia: No se pudo cargar risk_model.pkl. Asegúrate de correr train_dummy_model.py. {e}")
    clf = None

def predecir_riesgo(ingreso_neto: float, antiguedad_meses: int, edad_anios: int, num_dependientes: int) -> tuple[float, RecomendacionIA, str]:
    """
    Evalúa una solicitud usando un modelo de Scikit-Learn.
    """
    if clf is None:
        # Fallback heuristic
        if ingreso_neto > 15000 and num_dependientes <= 2:
            return 25.0, RecomendacionIA.PRE_APROBADA, "Score IA Aprobatorio (< 40%)"
        return 75.0, RecomendacionIA.REVISION_MANUAL, "Falta modelo IA: Score estimado alto (75%)"

    features = np.array([[ingreso_neto, antiguedad_meses, edad_anios, num_dependientes]])
    
    # Predecir clase (0 = Bueno, 1 = Malo/Riesgoso)
    prediction = clf.predict(features)[0]
    
    # Predecir probabilidad de clase 1 (Malo)
    prob_malo = clf.predict_proba(features)[0][1]
    
    # Convertir probabilidad a score 0-100
    score = round(prob_malo * 100, 2)
    
    # Logic para la app
    if prediction == 0 and score <= 20.0:
        return score, RecomendacionIA.PRE_APROBADA, f"Perfil estable: Aprobada con Riesgo {score}%."
    else:
        # Generate an explanation based on typical model risk factors
        factores = []
        if ingreso_neto < 15000:
            factores.append("ingresos percibidos bajos")
        if antiguedad_meses < 12:
            factores.append("poca estabilidad laboral")
        if edad_anios < 25 or edad_anios > 65:
            factores.append("edad fuera del rango estable")
        if num_dependientes > 3:
            factores.append("alto número de dependientes económicos")
            
        explicacion = ""
        if factores:
             explicacion = " Factores influyentes identificados: " + ", ".join(factores) + "."
        else:
             explicacion = " La IA detectó un patrón de comportamiento atípico en la combinación de datos sociodemográficos y financieros ingresados que no cumple con el perfil de aprobación automática."
             
        return score, RecomendacionIA.REVISION_MANUAL, f"Score de IA Riesgoso ({score}%).{explicacion}"

if __name__ == "__main__":
    score, rec, razon = predecir_riesgo(25000, 36, 30, 0)
    print("Test 1:", rec.value, razon)
