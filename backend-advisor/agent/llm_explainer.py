# agent/llm_explainer.py
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

# Create the client with your Gemini API key
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def explain_with_llm(messages, language="en"):
    """
    messages: list of system-generated insights
    language: 'en' or 'ur'
    """
    # Combine messages into text
    joined_insights = "\n".join(messages)

    # Build the prompt
    prompt = f"""
You are a professional AI financial advisor.

Language: {language}

User financial insights:
{joined_insights}

Explain the situation clearly, politely, and practically.
Give actionable advice.
"""

    # Call the Gemini model
    response = client.models.generate_content(
        model="gemini-2.5-flash",  # use an appropriate model name
        contents=prompt
    )

    # Extract text
    return response.text
