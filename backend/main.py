from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import io
import os

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