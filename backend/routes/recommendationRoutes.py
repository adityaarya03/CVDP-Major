from flask import Blueprint
from controllers.recommendationController import get_recommendations

recommendation_bp = Blueprint("recommendation", __name__)
recommendation_bp.route("/recommendations", methods=["POST"])(get_recommendations)
