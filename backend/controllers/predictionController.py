from flask import Blueprint, request, jsonify
from services.mlService import load_models, predict_with_models, load_scaler, FEATURES
from models.predictionModel import PredictionModel  # Import prediction model
import numpy as np
from flask_jwt_extended import jwt_required, get_jwt_identity  # Import JWT methods
from middlewares.errorHandler import handle_error  # Import error handler

# Create a Blueprint for prediction routes
prediction_bp = Blueprint("prediction", __name__)

# Load trained models
models = load_models()

# Load the pre-trained StandardScaler
scaler = load_scaler()

@prediction_bp.route("/predict", methods=["POST"])
@jwt_required()  # Require authentication
def predict():
    try:
        user_id = get_jwt_identity()  # Get user ID from JWT token
        data = request.get_json()

        if not data:
            return handle_error("No input data provided", 400)

        # Validate that all required features are present
        missing_features = [feature for feature in FEATURES if feature not in data]
        if missing_features:
            return handle_error(f"Missing input features: {', '.join(missing_features)}", 400)

        # Convert input data to numpy array
        input_features = np.array([[data[feature] for feature in FEATURES]])

        # Apply StandardScaler transformation
        try:
            input_scaled = scaler.transform(input_features)
        except ValueError as e:
            return handle_error(f"Scaler input mismatch: {str(e)}", 400)

        # Get predictions from all models
        model_predictions = {}
        for model_name, (model, selected_features) in models.items():
            model_predictions[model_name.split("_")[0]] = predict_with_models(model, selected_features, input_scaled)

        # Calculate the average prediction
        avg_prediction = sum(model_predictions.values()) / len(model_predictions)

        # Save to MongoDB with user reference
        PredictionModel.save_prediction(user_id, data, model_predictions)

        return jsonify({"predictions": model_predictions, "average_prediction": avg_prediction})
    except Exception as e:
        return handle_error(str(e), 500)


@prediction_bp.route("/history", methods=["GET"])
@jwt_required()  # Require authentication
def get_prediction_history():
    try:
        user_id = get_jwt_identity()  # Get user ID from JWT token
        history = PredictionModel.get_recent_predictions(user_id, 10)
        return jsonify({"history": history})
    except Exception as e:
        return handle_error("Server error", 500)
