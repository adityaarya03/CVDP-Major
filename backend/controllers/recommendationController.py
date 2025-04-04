from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.healthModel import HealthModel
from services.huggingFaceService import HuggingFaceService
from middlewares.errorHandler import handle_error

@jwt_required()
def get_recommendations():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        height = data.get("height")
        weight = data.get("weight")

        if not height or not weight:
            return handle_error("Height and weight are required", 400)

        report = HealthModel.generate_report(user_id)
        if not report:
            return handle_error("No health report found for recommendations", 404)

        recommendations = HuggingFaceService.generate_recommendations(report, height, weight)

        return jsonify({
            "message": "Recommendations generated successfully",
            "recommendations": recommendations
        }), 200
    except Exception as e:
        return handle_error(str(e), 500)
