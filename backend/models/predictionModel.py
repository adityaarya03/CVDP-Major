from config.db import db
from datetime import datetime

class PredictionModel:
    collection = db["predictions"]  # MongoDB collection

    @staticmethod
    def save_prediction(user_id, input_data, predictions):
        """Save the prediction result to MongoDB with user reference."""
        # Compute average prediction from all model outputs
        try:
            avg_prediction = sum(predictions.values()) / len(predictions)
        except:
            avg_prediction = None

        prediction_data = {
            "user_id": user_id,
            "input_data": input_data,
            "predictions": predictions,
            "average_prediction": avg_prediction,
            "timestamp": datetime.utcnow()
        }
        return PredictionModel.collection.insert_one(prediction_data).inserted_id


    @staticmethod
    def get_recent_predictions(user_id, limit=10):
        """Fetch recent prediction history for a specific user."""
        history = list(
            PredictionModel.collection.find({"user_id": user_id})
            .sort("timestamp", -1)
            .limit(limit)
        )
        for record in history:
            record["_id"] = str(record["_id"])  # Convert ObjectId to string
        return history
