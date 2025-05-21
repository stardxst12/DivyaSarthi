from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app)  # Allow frontend to communicate

import joblib

# Load Model
model_data = joblib.load('parkinsons_model_probdict.pkl')
model = model_data['model']

DETECTION_STATUS = {"enabled": False}
FEATURES = ['tremorCount', 'misclickCount', 'typoCount', 'tremorFrequency']
CLASS_NAMES = ["Non-Parkinson's", "Mild Parkinson's", "Moderate Parkinson's", "Severe Parkinson's"]

detection_enabled = False 
@app.route('/detection_status', methods=['GET', 'POST'])
def detection_status():
    global detection_enabled
    if request.method == 'GET':
        return jsonify({"status": detection_enabled})  # Send current status

    data = request.json
    detection_enabled = data.get("enabled", False)
    return jsonify({"message": "Detection status updated", "enabled": detection_enabled})

@app.route('/predict', methods=['POST'])
def predict():
    if request.method != 'POST':
        return jsonify({"message": "Use POST to send data for prediction"}), 405

    data = request.json
    if not data:
        return jsonify({"error": "Missing JSON data"}), 400

    required_keys = ['tremorCount', 'misclickCount', 'typoCount', 'tremorFrequency']
    if not all(key in data for key in required_keys):
        return jsonify({"error": "Missing required keys"}), 400

    # Compute missing features
    tremor_typo_ratio = data['tremorCount'] / (data['typoCount'] + 1e-6)
    motor_score = 0.4 * data['tremorCount'] + 0.6 * data['misclickCount']

    # Create the feature array
    features = np.array([
        data['tremorCount'],
        data['misclickCount'],
        data['typoCount'],
        data['tremorFrequency'],
    ]).reshape(1, -1)

    proba = model.predict_proba(features.reshape(1, -1))  # Get probabilities
    severity_index = np.argmax(proba)  # Pick class with highest probability
    severity = ["Non-Parkinson's", "Mild Parkinson's", "Moderate Parkinson's", "Severe Parkinson's"][severity_index]

    return jsonify({"severity": severity, "probabilities": proba.tolist()})  # Send probabilities too

    prediction = model.predict(features)
    severity = ["Non-Parkinson's", "Mild Parkinson's", "Moderate Parkinson's", "Severe Parkinson's"][prediction[0]]

    return jsonify({"severity": severity})

@app.route('/')
def home():
    statement = 'Parkinsons Detection Backend is running!!'
    return statement
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
