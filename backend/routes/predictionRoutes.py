from flask import Blueprint
from controllers.predictionController import predict, get_prediction_history

prediction_bp = Blueprint("prediction", __name__)

prediction_bp.route("/predict", methods=["POST"])(predict) # Register predict route route
prediction_bp.route("/history", methods=["GET"])(get_prediction_history)  # Register history route