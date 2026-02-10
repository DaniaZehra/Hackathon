from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import io
import os

import bcrypt
from pydantic import BaseModel

load_dotenv()

from models.user import User
from voice.assistent import (
    transcribe_audio,
    process_command,
    text_to_speech
)

app = FastAPI(title="Voice Banking API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Voice Banking API Running ✅"}


class SignupRequest(BaseModel):
    firstname: str
    lastname: str
    username: str
    password: str


class LoginRequest(BaseModel):
    username: str
    password: str


class UpdateUserRequest(BaseModel):
    firstname: str | None = None
    lastname: str | None = None
    username: str | None = None
    password: str | None = None
    balance: float | None = None
    monthly_spends: float | None = None
    daily_avg_spend: float | None = None

def hash_password(plain_password: str) -> str:
    return bcrypt.hashpw(plain_password.encode("utf-8"), bcrypt.gensalt()).decode(
        "utf-8"
    )


def verify_password(plain_password: str, stored_password: str) -> bool:
    if stored_password.startswith("$2b$"):
        return bcrypt.checkpw(plain_password.encode("utf-8"), stored_password.encode("utf-8"))
    return plain_password == stored_password

@app.post("/voice")
async def voice_command(
    file: UploadFile = File(...),
    username: str = "testuser"
):
    try:
        text = transcribe_audio(file)
        print("User Said:", text)

        reply_text = process_command(text, username)
        print("AI Reply:", reply_text)

        audio_bytes = text_to_speech(reply_text)
        return StreamingResponse(
            io.BytesIO(audio_bytes),
            media_type="audio/mpeg"
        )

    except Exception as e:
        return {"error": str(e)}


@app.post("/auth/signup")
def signup(payload: SignupRequest):
    existing = User.objects(username=payload.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username is already taken")

    user = User(
        firstname=payload.firstname,
        lastname=payload.lastname,
        username=payload.username,
        password=hash_password(payload.password),
    )
    user.save()

    return {
        "message": "User registered successfully",
        "user": {
            "id": str(user.id),
            "firstname": user.firstname,
            "lastname": user.lastname,
            "username": user.username,
            "balance": user.balance,
        },
    }


@app.post("/auth/login")
def login(payload: LoginRequest):
    user = User.objects(username=payload.username).first()
    if not user or not verify_password(payload.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return {
        "message": "Login successful",
        "user": {
            "id": str(user.id),
            "firstname": user.firstname,
            "lastname": user.lastname,
            "username": user.username,
            "balance": user.balance,
        },
    }


# Dummy User for testing - Changed to GET so you can use browser
@app.get("/create-test-user")
def create_test_user():
    try:
        # Check if user already exists
        existing_user = User.objects(username="testuser").first()
        if existing_user:
            return {
                "message": "Test user already exists",
                "username": existing_user.username,
                "balance": existing_user.balance
            }

        # Create new user
        user = User(
            firstname="Ali",
            lastname="Khan",
            username="testuser",
            password="123456",
            balance=25000,
            monthly_spends=12000,
            daily_avg_spend=400,
            transaction_history=[]
        )
        user.save()
        
        # Verify it was saved
        saved_user = User.objects(username="testuser").first()
        if saved_user:
            return {
                "message": "Test user created ✅",
                "username": saved_user.username,
                "balance": saved_user.balance
            }
        else:
            return {"error": "User created but not found in DB"}
            
    except Exception as e:
        return {"error": f"Failed to create user: {str(e)}"}

    
@app.get("/user/{username}")
def get_user(username: str):
    try:
        user = User.objects(username=username).exclude("password").first()
        if not user:
            return {"error": "User not found"}

        return {
            "firstname": user.firstname,
            "lastname": user.lastname,
            "username": user.username,
            "balance": user.balance,
            "monthly_spends": user.monthly_spends,
            "daily_avg_spend": user.daily_avg_spend,
            "transaction_history": user.transaction_history
        }
    except Exception as e:
        return {"error": f"Failed to get user: {str(e)}"}


@app.put("/user/{username}")
def update_user(username: str, payload: UpdateUserRequest):
    user = User.objects(username=username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    data = payload.model_dump(exclude_unset=True)

    if "username" in data and data["username"] != username:
        if User.objects(username=data["username"]).first():
            raise HTTPException(status_code=400, detail="Username is already taken")

    if "password" in data:
        data["password"] = hash_password(data["password"])

    for field, value in data.items():
        setattr(user, field, value)

    user.save()

    return {
        "message": "User updated successfully",
        "user": {
            "id": str(user.id),
            "firstname": user.firstname,
            "lastname": user.lastname,
            "username": user.username,
            "balance": user.balance,
            "monthly_spends": user.monthly_spends,
            "daily_avg_spend": user.daily_avg_spend,
        },
    }