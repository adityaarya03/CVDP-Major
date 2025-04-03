from flask import Flask
from flask_cors import CORS
from routes.predictionRoutes import prediction_bp

app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(prediction_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)
