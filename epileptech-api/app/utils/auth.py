from flask import request, jsonify, g
from functools import wraps
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
import os
from app.database.database import users_collection
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Security setup
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-for-jwt")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_token_from_header():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    return auth_header.split(" ")[1]

def get_current_user():
    token = get_token_from_header()
    if not token:
        return None
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
    except JWTError:
        return None
    
    user = users_collection.find_one({"_id": user_id})
    if user is None:
        return None
    
    return user

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({"detail": "Could not validate credentials"}), 401
        g.current_user = user
        return f(*args, **kwargs)
    return decorated_function

def doctor_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({"detail": "Could not validate credentials"}), 401
        if user.get("role") != "doctor":
            return jsonify({"detail": "Permission denied"}), 403
        g.current_user = user
        return f(*args, **kwargs)
    return decorated_function