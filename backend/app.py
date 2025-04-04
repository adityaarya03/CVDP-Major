from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from routes.predictionRoutes import prediction_bp
from routes.authRoutes import auth_bp
from routes.healthRoutes import health_bp
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables

app = Flask(__name__)
CORS(app)

# JWT Configuration
app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY")  # Change this to a strong secret key
app.config["JWT_TOKEN_LOCATION"] = ["headers"]  # Ensure tokens are sent in headers

# Initialize JWT
jwt = JWTManager(app)

# Register Blueprints
app.register_blueprint(prediction_bp, url_prefix="/api")
app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(health_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)
