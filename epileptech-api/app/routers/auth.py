from flask import Blueprint, request, jsonify
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os
from app.database.database import users_collection
from dotenv import load_dotenv
from functools import wraps

# Load environment variables
load_dotenv()

# Security setup
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-for-jwt")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create blueprint
router = Blueprint('auth', __name__, url_prefix='/api/auth')

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
        
    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        
        if username is None:
            return None
            
        user = users_collection.find_one({"username": username})
        return user
    except JWTError:
        return None

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({"error": "Could not validate credentials"}), 401
        return f(*args, **kwargs)
    return decorated_function

# Routes
@router.route('/register', methods=['POST'])
def register_user():
    """Register a new user (doctor or patient)"""
    try:
        data = request.get_json()
        
        # Check if username or email already exists
        existing_user = users_collection.find_one(
            {"$or": [{"username": data["username"]}, {"email": data["email"]}]}
        )
        
        if existing_user:
            return jsonify({"error": "Username or email already registered"}), 400
        
        # Create new user document
        user_data = data.copy()
        
        # Hash the password
        user_data["password"] = get_password_hash(user_data["password"])
        
        # Add created_at field
        user_data["created_at"] = datetime.utcnow()
        
        # Insert into database
        users_collection.insert_one(user_data)
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": data["username"]}, expires_delta=access_token_expires
        )
        
        return jsonify({
            "access_token": access_token,
            "token_type": "bearer",
            "user_type": "doctor" if data.get("is_doctor", True) else "patient"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@router.route('/login', methods=['POST'])
def login_for_access_token():
    """Login route to get an access token"""
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        
        if not username or not password:
            return jsonify({"error": "Username and password are required"}), 400
        
        # Find user by username
        user = users_collection.find_one({"username": username})
        
        # Check if user exists and password is correct
        if not user or not verify_password(password, user["password"]):
            return jsonify({"error": "Incorrect username or password"}), 401
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": username}, expires_delta=access_token_expires
        )
        
        return jsonify({
            "access_token": access_token,
            "token_type": "bearer",
            "user_type": "doctor" if user["is_doctor"] else "patient"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@router.route('/me', methods=['GET'])
@login_required
def read_users_me():
    """Get current user information"""
    try:
        user = get_current_user()
        # Remove sensitive information
        user_data = {k: v for k, v in user.items() if k != "password"}
        user_data["_id"] = str(user_data["_id"])  # Convert ObjectId to string
        
        return jsonify(user_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500