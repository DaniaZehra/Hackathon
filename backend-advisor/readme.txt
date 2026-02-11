# AdvisorFin - AI Financial Advisor

An intelligent financial advisor agent that analyzes spending patterns
and provides personalized financial advice using AI.

## Features
- Transaction analysis and categorization
- Balance monitoring and alerts
- Spending insights and recommendations
- LLM-powered explanations (Gemini API)
- Multi-language support (English/Urdu)
- Voice output capability
- Memory of past advice and interactions

## Tech Stack
- **Backend**: FastAPI (Python)
- **Database**: MongoDB with MongoEngine
- **AI/ML**: Google Gemini API
- **Text-to-Speech**: gTTS (optional)
- **Architecture**: Modular agent system

## Project Structure
advisorfin/
├── main.py # FastAPI application
├── models/ # Database models
│ └── users.py # User model
├── agent/ # AI agent modules
│ ├── agent.py # Main agent orchestrator
│ ├── perception.py # Data observation
│ ├── reasoning.py # Decision making
│ ├── planner.py # Action planning
│ ├── actions.py # Action execution
│ ├── llm_explainer.py # Gemini AI integration
│ └── memory.py # Agent memory
├── voice/ # TTS module (optional)
│ └── tts.py
└── requirements.txt # Dependencies