from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from routes.predictionRoutes import prediction_bp
from routes.authRoutes import auth_bp
from routes.healthRoutes import health_bp
import os
from dotenv import load_dotenv
from routes.recommendationRoutes import recommendation_bp



load_dotenv()  # Load environment variables

app = Flask(__name__)

# CORS Configuration

CORS(app, 
     origins=os.getenv("CORS_ORIGINS").split(","),
     supports_credentials=True,
     expose_headers=["Set-Cookie"],
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# JWT Configuration
app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_COOKIE_SECURE"] = False  # ✅ for localhost
app.config["JWT_COOKIE_SAMESITE"] = "Lax"
app.config["JWT_ACCESS_COOKIE_PATH"] = "/"
app.config["JWT_COOKIE_CSRF_PROTECT"] = False
app.config["JWT_COOKIE_NAME"] = "access_token_cookie"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 3600  # 1 hour
app.config["JWT_COOKIE_DOMAIN"] = None  # Let the browser handle the domain
app.config["JWT_COOKIE_NAME"] = "access_token_cookie"  # Explicitly set cookie name

# Initialize JWT
jwt = JWTManager(app)

# Register Blueprints
app.register_blueprint(prediction_bp, url_prefix="/api")
app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(health_bp, url_prefix="/api")
app.register_blueprint(recommendation_bp, url_prefix="/api")

# if __name__ == "__main__":
#     app.run(debug=True, host="127.0.0.1", port=5000)
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5002))
    app.run(debug=True, host="0.0.0.0", port=port)