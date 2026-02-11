# main.py
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from agent.agent import run_financial_agent
from voice.tts import text_to_speech  # optional
from models.users import User

app = FastAPI(title="AdvisorFin API")


@app.post("/financial-advisor")
def financial_advisor(user_id: str, language: str = "en"):
    user = User.objects(id=user_id).first()
    if not user:
        return {"error": "User not found"}

    text, actions, past = run_financial_agent(user_id, language)

    return {
        "text_response": text,
        "actions_taken": actions,
        "past_history": past
    }


@app.post("/voice-output")
def voice_output_endpoint(text: str, language: str = "en"):
    audio_path = text_to_speech(text, language)
    return FileResponse(audio_path, media_type="audio/mpeg")


@app.post("/voice-financial-advisor")
async def voice_financial_advisor(
    audio: UploadFile = File(...),
    language: str = "en"
):
    # For now: skip STT (Whisper)
    transactions = []

    text, actions, past = run_financial_agent(
        user_id="voice_user",
        language=language
    )

    audio_path = text_to_speech(text, language)
    return FileResponse(audio_path, media_type="audio/mpeg")
