import os
import requests
from dotenv import load_dotenv
from models.user import User

load_dotenv()

API_URL = "https://api.upliftai.org/v1/transcribe/speech-to-text"
API_KEY = os.getenv("UPLIFT_API_KEY")


def transcribe_audio(file):
    headers = {
        "Authorization": f"Bearer {API_KEY}"
    }

    data = {
        "model": "scribe",
        "language": "ur"
    }

    files = {
        "file": (file.filename, file.file, file.content_type)
    }

    response = requests.post(
        API_URL,
        headers=headers,
        files=files,
        data=data
    )

    result = response.json()
    return result.get("transcript", "").lower()


def process_command(text, username):
    user = User.objects(username=username).first()

    # Auto-create user if doesn't exist
    if not user:
        user = User(
            firstname="User",
            lastname=username,
            username=username,
            password="default123",
            balance=25000,
            monthly_spends=12000,
            daily_avg_spend=400,
            transaction_history=[]
        )
        user.save()
        return f"Aap ka naya account ban gaya hai. Aap ka balance {int(user.balance)} rupay hai."

    # Monthly spend - CHECK THIS FIRST before balance
    if (
        "mahine" in text 
        or "مہینے" in text 
        or "ماہ" in text
        or "خرچ" in text
        or "kharch" in text
        or "spend" in text
    ):
        return f"Is mahine aap ne {int(user.monthly_spends)} rupay kharch kiye."

    # Balance query
    if (
        "balance" in text
        or "بیلنس" in text
        or "رقم" in text
        or "پیسے" in text
        or "پيسے" in text
        or "paisay" in text
        or "paise" in text
        or "amount" in text
        or "rupees" in text
        or "rupay" in text
    ):
        return f"Aap ka balance {int(user.balance)} rupay hai."


    return "Maaf keejeeye, main samajh nahee sakee."
def text_to_speech(text):
    url = "https://api.upliftai.org/v1/synthesis/text-to-speech"

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "voiceId": "v_8eelc901",
        "text": text,
        "outputFormat": "MP3_22050_128"
    }

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code != 200:
        raise Exception("Text-to-Speech failed")

    return response.content