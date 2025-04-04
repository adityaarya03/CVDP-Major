from flask import Blueprint, request, jsonify
import jwt
import datetime
import os
from functools import wraps
from models.userModel import UserModel
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

auth_bp = Blueprint("auth_bp", __name__)

def token_required(f):
    """Middleware to protect routes with JWT authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Token is missing"}), 401
        try:
            decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = UserModel.get_user_by_id(decoded_token["user_id"])
            if not current_user:
                return jsonify({"error": "User not found"}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        return f(current_user, *args, **kwargs)
    return decorated

@auth_bp.route("/signup", methods=["POST"])
def signup():
    """Handles user registration"""
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    response, status_code = UserModel.create_user(name, email, password)
    return jsonify(response), status_code

@auth_bp.route("/login", methods=["POST"])
def login():
    """Handles user login"""
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = UserModel.verify_user(email, password)
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    token = jwt.encode(
    {
        "user_id": str(user["_id"]),
        "sub": str(user["_id"]),  # ✅ Add "sub" claim
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)  
    },
    SECRET_KEY,
    algorithm="HS256"
    )
    return jsonify({"message": "Login successful", "token": token, "user_id": user["_id"]}), 200
