import hashlib
import os
import secrets
from datetime import datetime, timedelta, timezone
from pathlib import Path
from threading import Lock

from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from pwdlib import PasswordHash
from pymongo import ASCENDING, MongoClient
from pymongo.errors import DuplicateKeyError


# --------------------------------
# HomeVolt Authentication
# --------------------------------

router = APIRouter(prefix="/auth", tags=["Authentication"])

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DB = os.getenv("MONGODB_DB", "homevolt")

if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI is missing from backend/.env")

client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
database = client[MONGODB_DB]

users_collection = database["users"]
sessions_collection = database["auth_sessions"]

# Ensure duplicate emails and duplicate tokens are blocked.
users_collection.create_index([("email", ASCENDING)], unique=True)
sessions_collection.create_index([("token_hash", ASCENDING)], unique=True)

# Automatically remove expired sessions.
sessions_collection.create_index(
    [("expires_at", ASCENDING)],
    expireAfterSeconds=0,
)

password_hasher = PasswordHash.recommended()

SESSION_DAYS = 7
RESET_CODE_MINUTES = 5
MAX_RESET_ATTEMPTS = 5

# Demo-only password-reset codes. These clear when the server restarts.
password_reset_codes = {}
password_reset_lock = Lock()


# --------------------------------
# Request models
# --------------------------------

class RegisterRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    confirm_password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    code: str = Field(pattern=r"^[0-9]{6}$")
    password: str = Field(min_length=8, max_length=128)
    confirm_password: str = Field(min_length=8, max_length=128)


# --------------------------------
# Helper functions
# --------------------------------

def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def datetime_as_text(value):
    if isinstance(value, datetime):
        return value.isoformat()

    return value


def public_user(user):
    return {
        "id": str(user["_id"]),
        "full_name": user["full_name"],
        "email": user["email"],
        "created_at": datetime_as_text(user["created_at"]),
    }


def create_session(user_id):
    token = secrets.token_urlsafe(32)
    token_hash = hash_token(token)

    expires_at = datetime.now(timezone.utc) + timedelta(days=SESSION_DAYS)

    sessions_collection.insert_one(
        {
            "user_id": user_id,
            "token_hash": token_hash,
            "expires_at": expires_at,
        }
    )

    return token, expires_at.isoformat()


# --------------------------------
# Register account
# --------------------------------

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(request: RegisterRequest):
    full_name = request.full_name.strip()
    email = str(request.email).strip().lower()

    if len(full_name) < 2:
        raise HTTPException(
            status_code=400,
            detail="Please enter your full name.",
        )

    if request.password != request.confirm_password:
        raise HTTPException(
            status_code=400,
            detail="Passwords do not match.",
        )

    user = {
        "full_name": full_name,
        "email": email,
        "password_hash": password_hasher.hash(request.password),
        "created_at": datetime.now(timezone.utc),
    }

    try:
        result = users_collection.insert_one(user)
    except DuplicateKeyError:
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists.",
        )

    user["_id"] = result.inserted_id

    return {
        "message": "Account created successfully.",
        "user": public_user(user),
    }


# --------------------------------
# Login
# --------------------------------

@router.post("/login")
def login(request: LoginRequest):
    email = str(request.email).strip().lower()

    user = users_collection.find_one({"email": email})

    if user is None or not password_hasher.verify(
        request.password,
        user["password_hash"],
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    token, expires_at = create_session(user["_id"])

    return {
        "message": "Login successful.",
        "access_token": token,
        "token_type": "bearer",
        "expires_at": expires_at,
        "user": public_user(user),
    }


# --------------------------------
# Forgot password (local demo only)
# --------------------------------

@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest):
    if os.getenv("HOMEVOLT_DEMO_RESET") != "1":
        raise HTTPException(
            status_code=403,
            detail="Demo password recovery is disabled.",
        )

    email = str(request.email).strip().lower()

    message = (
        "If the account exists, a verification code "
        "has been generated in the backend terminal."
    )

    user = users_collection.find_one(
        {"email": email},
        {"_id": 1},
    )

    if user is None:
        return {"message": message}

    with password_reset_lock:
        existing = password_reset_codes.get(email)
        now = datetime.now(timezone.utc)

        if existing and now < existing["expires_at"]:
            return {"message": message}

        code = str(secrets.randbelow(1_000_000)).zfill(6)

        password_reset_codes[email] = {
            "code_hash": hash_token(code),
            "expires_at": now + timedelta(minutes=RESET_CODE_MINUTES),
            "attempts": 0,
        }

        print("\n--------------------------------")
        print("HOMEVOLT PASSWORD RESET (DEMO)")
        print(f"Verification Code: {code}")
        print("Valid for 5 minutes")
        print("--------------------------------\n", flush=True)

    return {"message": message}


# --------------------------------
# Reset password (local demo only)
# --------------------------------

@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest):
    if os.getenv("HOMEVOLT_DEMO_RESET") != "1":
        raise HTTPException(
            status_code=403,
            detail="Demo password recovery is disabled.",
        )

    email = str(request.email).strip().lower()

    if request.password != request.confirm_password:
        raise HTTPException(
            status_code=400,
            detail="Passwords do not match.",
        )

    with password_reset_lock:
        reset_data = password_reset_codes.get(email)

        if reset_data is None:
            raise HTTPException(
                status_code=400,
                detail="Invalid or expired verification code.",
            )

        if datetime.now(timezone.utc) >= reset_data["expires_at"]:
            password_reset_codes.pop(email, None)

            raise HTTPException(
                status_code=400,
                detail="Verification code has expired.",
            )

        if reset_data["attempts"] >= MAX_RESET_ATTEMPTS:
            raise HTTPException(
                status_code=429,
                detail="Too many attempts. Wait for the code to expire.",
            )

        if not secrets.compare_digest(
            reset_data["code_hash"],
            hash_token(request.code),
        ):
            reset_data["attempts"] += 1

            raise HTTPException(
                status_code=400,
                detail="Incorrect verification code.",
            )

        user = users_collection.find_one({"email": email})

        if user is None:
            raise HTTPException(
                status_code=400,
                detail="Password reset failed.",
            )

        users_collection.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "password_hash": password_hasher.hash(request.password),
                }
            },
        )

        # Invalidate all existing logins for this user.
        sessions_collection.delete_many({"user_id": user["_id"]})

        password_reset_codes.pop(email, None)

    return {
        "message": "Password reset successfully.",
    }