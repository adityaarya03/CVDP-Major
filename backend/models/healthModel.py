from models.predictionModel import PredictionModel
from models.userModel import UserModel  # Add this import
from config.db import db
from datetime import datetime

class HealthModel:
    collection = db["health_reports"]

    @staticmethod
    def generate_report(user_id, num_records=10):
        predictions = PredictionModel.get_recent_predictions(user_id, num_records)
        if not predictions:
            return None

        user = UserModel.get_user_by_id(user_id)
        if not user:
            return None

        name = user.get("name")
        age = user.get("age")
        gender = user.get("gender")

        numeric_fields = [
            "restingBP", "serumcholestrol", "fastingbloodsugar",
            "maxheartrate", "oldpeak", "noofmajorvessels"
        ]
        
        report_data = {field: [] for field in numeric_fields}
        risk_scores = []

        for entry in predictions:
            input_data = entry.get("input_data", {})
            for field in numeric_fields:
                value = input_data.get(field)
                if isinstance(value, (int, float)):
                    report_data[field].append(value)

            avg_pred = entry.get("average_prediction")
            if avg_pred is None and isinstance(entry.get("predictions"), dict):
                model_vals = entry["predictions"].values()
                try:
                    avg_pred = sum(model_vals) / len(model_vals)
                except:
                    avg_pred = None
            if avg_pred is not None:
                risk_scores.append(avg_pred)

        avg_data = {
            field: round(sum(values) / len(values), 2) if values else None
            for field, values in report_data.items()
        }
        avg_risk = round(sum(risk_scores) / len(risk_scores), 2) if risk_scores else None

        report = {
            "user_id": user_id,
            "name": name,
            "age": age,
            "gender": gender,
            "average_metrics": avg_data,
            "average_risk_score": avg_risk,
            "total_entries": len(predictions),
            "generated_at": datetime.utcnow()
        }

        inserted = HealthModel.collection.insert_one(report)
        report["_id"] = str(inserted.inserted_id)
        return report
