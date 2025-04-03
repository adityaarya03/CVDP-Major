from flask import Blueprint, request, jsonify
from services.mlService import load_models, predict_with_models, load_scaler, FEATURES
import numpy as np

# Create a Blueprint for prediction routes
prediction_bp = Blueprint("prediction", __name__)

# Load trained models
models = load_models()

# Load the pre-trained StandardScaler
scaler = load_scaler()

@prediction_bp.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data provided"}), 400

        # Validate that all required features are present
        missing_features = [feature for feature in FEATURES if feature not in data]
        if missing_features:
            return jsonify({"error": f"Missing input features: {', '.join(missing_features)}"}), 400

        # Convert input data to numpy array
        input_features = np.array([[data[feature] for feature in FEATURES]])

        # Apply StandardScaler transformation
        try:
            input_scaled = scaler.transform(input_features)
        except ValueError as e:
            return jsonify({"error": f"Scaler input mismatch: {str(e)}"}), 400

        # Get predictions from all models
        model_predictions = {}
        for model_name, (model, selected_features) in models.items():
            model_predictions[model_name.split("_")[0]] = predict_with_models(model, selected_features, input_scaled)

        # Calculate the average prediction
        avg_prediction = sum(model_predictions.values()) / len(model_predictions)

        return jsonify({"predictions": model_predictions, "average_prediction": avg_prediction})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
