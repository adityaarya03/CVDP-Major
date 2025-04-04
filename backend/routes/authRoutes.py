from flask import Blueprint
from controllers.authController import signup, login, get_profile, update_profile, logout

auth_bp = Blueprint("auth", __name__)

auth_bp.route("/signup", methods=["POST"])(signup)
auth_bp.route("/login", methods=["POST"])(login)
auth_bp.route("/profile",methods=["GET"])(get_profile)
auth_bp.route("/profile", methods=["PUT"])(update_profile)
auth_bp.route("/logout", methods=["POST"])(logout)