from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
import os
from dotenv import load_dotenv
import logging

# Load environment variables from .env file
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get MongoDB connection string from environment variables or use default
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "test")

# MongoDB client instance
client = MongoClient(MONGODB_URL)
db = client[DB_NAME]

# Collections
users_collection = db["users"]
eeg_reports_collection = db["eeg_reports"]
patients_collection = db["patients"]

def init_db():
    """Initialize database connection and create indexes"""
    try:
        # Check if the connection is successful
        client.admin.command('ping')
        logger.info("Connected to MongoDB!")
        
        # Create indexes
        users_collection.create_index("username", unique=True)
        users_collection.create_index("email", unique=True)
        eeg_reports_collection.create_index("eeg_id", unique=True)
        patients_collection.create_index("patient_id", unique=True)
        
    except ServerSelectionTimeoutError:
        logger.error("Cannot connect to MongoDB!")
        raise Exception("Database connection error")