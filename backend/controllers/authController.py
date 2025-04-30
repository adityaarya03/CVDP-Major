from flask import Blueprint, request, jsonify
import os
from models.userModel import UserModel
from dotenv import load_dotenv
from middlewares.authMiddleware import token_required  # Import middleware
from middlewares.errorHandler import handle_error  # Import error handler
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_jwt_extended import create_access_token, set_access_cookies, unset_jwt_cookies


load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")

auth_bp = Blueprint("auth_bp", __name__)


@auth_bp.route("/signup", methods=["POST"])
def signup():
    """Handles user registration"""
    data = request.json
    name = data.get("name")
    age = data.get("age")
    gender = data.get("gender")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return handle_error("All fields are required", 400)

    response, status_code = UserModel.create_user(
        name, email, password, age, gender)
    return jsonify(response), status_code

# @auth_bp.route("/login", methods=["POST"])
# def login():
#     """Handles user login"""
#     data = request.json
#     email = data.get("email")
#     password = data.get("password")

#     if not email or not password:
#         return handle_error("Email and password are required", 400)

#     user = UserModel.verify_user(email, password)
#     if not user:
#         return handle_error("Invalid email or password", 401)

#     token = jwt.encode(
#     {
#         "user_id": str(user["_id"]),
#         "sub": str(user["_id"]),  # ✅ Add "sub" claim
#         "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
#     },
#     SECRET_KEY,
#     algorithm="HS256"
#     )
#     return jsonify({"message": "Login successful", "token": token, "user_id": user["_id"]}), 200


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return handle_error("Email and password are required", 400)

    user = UserModel.verify_user(email, password)
    if not user:
        return handle_error("Invalid email or password", 401)

    access_token = create_access_token(identity=str(user["_id"]))
    response = jsonify({
        "message": "Login successful",
        "user_id": str(user["_id"]),
    })
    set_access_cookies(
        response,
        access_token,      # ✅ needed for cross-origin
    )  # Set max age to match token expiration
    return response, 200


@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = UserModel.get_user_by_id(user_id)
    if not user:
        return handle_error("User not found", 404)

    user["_id"] = str(user["_id"])
    return jsonify(user), 200


@auth_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data = request.get_json()

    # Only allow specific fields
    update_fields = {}
    for field in ["name", "age", "gender"]:
        if field in data:
            update_fields[field] = data[field]

    if not update_fields:
        return handle_error("No valid fields provided to update", 400)

    result = UserModel.collection.update_one(
        {"_id": user_id},
        {"$set": update_fields}
    )

    if result.matched_count == 0:
        return handle_error("User not found", 404)

    return jsonify({"message": "Profile updated successfully"}), 200

# @auth_bp.route("/logout", methods=["POST"])
# @jwt_required()
# def logout():
#     # Nothing to do server-side if using stateless JWTs
#     return jsonify({"message": "Logged out successfully"}), 200


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    response = jsonify({"message": "Logged out successfully"})
    unset_jwt_cookies(response)
    return response, 200
