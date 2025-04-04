from functools import wraps
from flask import request, jsonify
import jwt
import os
from models.userModel import UserModel
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")

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
