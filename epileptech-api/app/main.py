from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from .routers import eeg, auth, reports, chatbot
from .database.database import init_db

# Load environment variables
load_dotenv()

# Create Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Register blueprints
app.register_blueprint(auth.router)
app.register_blueprint(eeg.router)
app.register_blueprint(reports.router)
app.register_blueprint(chatbot.router)

@app.route('/')
def root():
    return jsonify({"message": "Welcome to EpilepTech API"})

# Initialize database on startup
# Replace deprecated before_first_request with with_appcontext
with app.app_context():
    init_db()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000, debug=True)

