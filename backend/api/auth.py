
import hashlib
import secrets
import sqlite3
import os
from threading import Lock
from datetime import datetime, timedelta, timezone
from pathlib import Path

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from pwdlib import PasswordHash


# --------------------------------
# HomeVolt Authentication
# --------------------------------

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Database location
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

DB_PATH = DATA_DIR / "users.db"

# Password hashing
password_hasher = PasswordHash.recommended()

# Session lifetime
SESSION_DAYS = 7
# Development-only password recovery
RESET_CODE_MINUTES = 5
MAX_RESET_ATTEMPTS = 5

password_reset_codes = {}
password_reset_lock = Lock()

# --------------------------------
# Database initialization
# --------------------------------

def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_auth_db():
    with get_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        """)

        conn.execute("""
            CREATE TABLE IF NOT EXISTS auth_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                token_hash TEXT NOT NULL UNIQUE,
                expires_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id)
                    ON DELETE CASCADE
            )
        """)


init_auth_db()


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


def public_user(user):
    return {
        "id": user["id"],
        "full_name": user["full_name"],
        "email": user["email"],
        "created_at": user["created_at"],
    }


def create_session(user_id: int):
    token = secrets.token_urlsafe(32)
    token_hash = hash_token(token)

    expires_at = (
        datetime.now(timezone.utc) + timedelta(days=SESSION_DAYS)
    ).isoformat()

    with get_connection() as conn:
        conn.execute(
            """
            INSERT INTO auth_sessions
                (user_id, token_hash, expires_at)
            VALUES (?, ?, ?)
            """,
            (user_id, token_hash, expires_at),
        )

    return token, expires_at


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
            detail="Please enter your full name."
        )

    if request.password != request.confirm_password:
        raise HTTPException(
            status_code=400,
            detail="Passwords do not match."
        )

    password_hash = password_hasher.hash(request.password)

    created_at = datetime.now(timezone.utc).isoformat()

    try:
        with get_connection() as conn:
            cursor = conn.execute(
                """
                INSERT INTO users
                    (full_name, email, password_hash, created_at)
                VALUES (?, ?, ?, ?)
                """,
                (full_name, email, password_hash, created_at),
            )

            user_id = cursor.lastrowid

            user = conn.execute(
                "SELECT * FROM users WHERE id = ?",
                (user_id,),
            ).fetchone()

    except sqlite3.IntegrityError:
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists."
        )

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

    with get_connection() as conn:
        user = conn.execute(
            "SELECT * FROM users WHERE email = ?",
            (email,),
        ).fetchone()

    if user is None or not password_hasher.verify(
        request.password,
        user["password_hash"],
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    token, expires_at = create_session(user["id"])

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
    print("DEMO RESET VALUE:", repr(os.getenv("HOMEVOLT_DEMO_RESET")), flush=True)
    if os.getenv("HOMEVOLT_DEMO_RESET") != "1":
        raise HTTPException(
            status_code=403,
            detail="Demo password recovery is disabled."
        )

    email = str(request.email).strip().lower()

    message = (
        "If the account exists, a verification code "
        "has been generated in the backend terminal."
    )

    with get_connection() as conn:
        user = conn.execute(
            "SELECT id FROM users WHERE email = ?",
            (email,),
        ).fetchone()

    if user is None:
        return {"message": message}

    with password_reset_lock:

        existing = password_reset_codes.get(email)
        now = datetime.now(timezone.utc)

        if existing and now < existing["expires_at"]:
            return {"message": message}

        code = str(secrets.randbelow(1000000)).zfill(6)

        password_reset_codes[email] = {
            "code_hash": hash_token(code),
            "expires_at": now + timedelta(
                minutes=RESET_CODE_MINUTES
            ),
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
            detail="Demo password recovery is disabled."
        )

    email = str(request.email).strip().lower()

    if request.password != request.confirm_password:
        raise HTTPException(
            status_code=400,
            detail="Passwords do not match."
        )

    with password_reset_lock:

        reset_data = password_reset_codes.get(email)

        if reset_data is None:
            raise HTTPException(
                status_code=400,
                detail="Invalid or expired verification code."
            )

        if datetime.now(timezone.utc) >= reset_data["expires_at"]:
            password_reset_codes.pop(email, None)

            raise HTTPException(
                status_code=400,
                detail="Verification code has expired."
            )

        if reset_data["attempts"] >= MAX_RESET_ATTEMPTS:
            raise HTTPException(
                status_code=429,
                detail="Too many attempts. Wait for the code to expire."
            )

        if not secrets.compare_digest(
            reset_data["code_hash"],
            hash_token(request.code)
        ):
            reset_data["attempts"] += 1

            raise HTTPException(
                status_code=400,
                detail="Incorrect verification code."
            )

        new_password_hash = password_hasher.hash(
            request.password
        )

        with get_connection() as conn:

            user = conn.execute(
                "SELECT id FROM users WHERE email = ?",
                (email,),
            ).fetchone()

            if user is None:
                raise HTTPException(
                    status_code=400,
                    detail="Password reset failed."
                )

            conn.execute(
                """
                UPDATE users
                SET password_hash = ?
                WHERE id = ?
                """,
                (new_password_hash, user["id"]),
            )

            # Invalidate existing login sessions
            conn.execute(
                "DELETE FROM auth_sessions WHERE user_id = ?",
                (user["id"],),
            )

        password_reset_codes.pop(email, None)

    return {
        "message": "Password reset successfully."
    }
