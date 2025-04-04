from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.healthModel import HealthModel
import os
from flask import send_file, jsonify
from services.pdfService import PDFService

health_bp = Blueprint("health", __name__)

@health_bp.route("/report", methods=["GET"])
@jwt_required()
def generate_health_report():
    try:
        user_id = get_jwt_identity()
        report = HealthModel.generate_report(user_id, num_records=10)

        if not report:
            return jsonify({"message": "No predictions found to generate report."}), 404

        return jsonify({"report": report}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@health_bp.route("/report/pdf", methods=["POST"])
@jwt_required()
def download_health_report():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        height = data.get("height")
        weight = data.get("weight")

        if not height or not weight:
            return jsonify({"message": "Height and weight are required"}), 400

        report = HealthModel.generate_report(user_id, num_records=10)

        if not report:
            return jsonify({"message": "No predictions found to generate report."}), 404

        from services.huggingFaceService import HuggingFaceService
        recommendations = HuggingFaceService.generate_recommendations(report, height, weight)

        pdf_path = PDFService.generate_health_report_pdf(report, user_id, recommendations)

        if not pdf_path or not os.path.exists(pdf_path):
            return jsonify({"message": "Failed to generate report."}), 500

        return send_file(pdf_path, as_attachment=True, download_name="Health_Report.pdf")

    except Exception as e:
        return jsonify({"error": str(e)}), 500
