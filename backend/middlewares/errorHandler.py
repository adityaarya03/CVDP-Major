from flask import jsonify

def handle_error(error_message, status_code=400):
    """Centralized error handler"""
    response = {"error": error_message}
    return jsonify(response), status_code
