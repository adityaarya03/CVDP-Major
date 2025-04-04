from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
from config.db import db

class UserModel:
    collection = db["users"]  # Collection for users

    @staticmethod
    def create_user(name, email, password, age=None, gender=None):
        """Creates a new user with hashed password."""
        if UserModel.collection.find_one({"email": email}):
            return {"error": "Email already exists"}, 400

        hashed_password = generate_password_hash(password)
        user_data = {
            "_id": str(uuid.uuid4()),
            "name": name,
            "email": email,
            "password": hashed_password,
            "age": age,
            "gender": gender
        }
        UserModel.collection.insert_one(user_data)
        return {"message": "User registered successfully"}, 201


    @staticmethod
    def verify_user(email, password):
        """Verifies user credentials for login."""
        user = UserModel.collection.find_one({"email": email})
        if not user or not check_password_hash(user["password"], password):
            return None  # Authentication failed
        return user  # Successful login

    @staticmethod
    def get_user_by_id(user_id):
        """Fetch user details by ID."""
        return UserModel.collection.find_one({"_id": user_id}, {"password": 0})  # Exclude password
