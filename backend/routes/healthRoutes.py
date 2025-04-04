from flask import Blueprint
from controllers.healthController import generate_health_report, download_health_report

health_bp = Blueprint("health", __name__)

health_bp.route("/report", methods=["GET"])(generate_health_report)
health_bp.route("/report/pdf", methods=["POST"])(download_health_report)

