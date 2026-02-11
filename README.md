# SecureSpend

A banking-style web app with voice commands, portfolio analysis, and a personal financial advisor. Built for a hackathon.

---

## What’s in the repo

- **Frontend** – React + Vite app (dashboard, voice UI, AI advisor, transactions).
- **Backend** – FastAPI service: auth, user, transfers, bills, add funds, voice API, portfolio analyze.
- **Backend-advisor** – Separate FastAPI service: personal financial advisor (text + optional voice), uses its own agent and DB.

You need **MongoDB** (e.g. Atlas) for user and transaction data. The main backend and the advisor backend can use the same or different DBs depending on how you wire them.

---

## Features

### Auth & user
- Sign up and login (username + password, bcrypt).
- Edit profile (name, username, password, balance, monthly/daily spend).
- Session handled in the frontend (e.g. cookie/local state); no JWT in this doc.

### Dashboard
- View balance, monthly spends, daily average spend.
- Time-based greeting (Good Morning / Afternoon / Evening / Night) and user first name from DB.
- Quick actions: Send Money, Pay Bills, Add Funds (each opens a modal).
- Recent transactions list and link to full transactions page.
- Sidebar + top bar (logo, search, notifications, profile menu, logout) shared across dashboard pages.

### Send money
- Recipient name, account/wallet ID, amount (100–20,000 PKR), purpose.
- Flat fee (e.g. 50 PKR). Balance and transaction history updated after success.

### Pay bills
- Category: electricity, gas, water, internet, mobile.
- Reference number, optional provider, amount, account source (savings/current).
- Deducts from balance and records in transaction history.

### Add funds
- Amount and source: debit card, credit card, or bank transfer.
- Card details or bank name/account as required; balance and history updated.

### Transactions
- Full list with filters: type (credit/debit), date range, category, amount range.
- Shows date, recipient/purpose, amount, fee, net. All amounts in PKR.

### Voice assistant
- Record audio in the browser, send to backend `/voice`.
- Backend transcribes, runs a command (e.g. balance, spends), returns audio reply.
- Uses backend voice pipeline (transcribe → process_command → text-to-speech).

### AI Advisors (two parts)

1. **Wealth advisor (portfolio analysis)**  
   - **Frontend:** Enter holdings (ticker, value in PKR, sector). Add multiple rows, then “Generate AI Report”.  
   - **Backend:** `POST /analyze` with holdings; uses `WealthManagementAgent` (e.g. CrewAI + Gemini) to produce a markdown report.  
   - Report shown in a card on the same page (tables, headings, blockquotes styled in the UI).

2. **Personal financial advisor**  
   - **Frontend:** AI Advisors page – language (English/Urdu), “Get Financial Advice”.  
   - **Backend-advisor:** `POST /financial-advisor?user_id=...&language=...`. Uses its own agent and user data, returns text response, actions taken, and past history.  
   - Response and any history shown in a second card below the wealth report.

Currency in the app is **PKR** (e.g. placeholders and labels). Any dollar amounts in the AI report text come from the agent; the UI is PKR-focused.

---

## How to run

### 1. MongoDB
- Create a cluster (e.g. MongoDB Atlas).
- Get connection string and put it in backend `.env` as `MONGO_URI`.
- Backend uses DB name `hackathonDB` and collection `users` (see `backend/models/user.py`).

### 2. Backend (main app)
```bash
cd backend
# optional: create venv and install
pip install -r requirements.txt
# set .env: MONGO_URI, and if needed GOOGLE_API_KEY for Gemini
uvicorn main:app --reload
```
Runs by default on `http://localhost:8000`.  
Endpoints: `/`, `/auth/signup`, `/auth/login`, `/user/{username}`, `/user/{username}/transfer`, `/user/{username}/add-funds`, `/user/{username}/pay-bill`, `/voice`, `/analyze`, etc.

### 3. Backend-advisor (financial advisor only)
```bash
cd backend-advisor
pip install -r req.txt   # or whatever the requirements file is named
# set .env (e.g. DB, API keys if used)
uvicorn main:app --reload --port 8001
```
Runs on `http://localhost:8001`.  
Frontend calls `POST /financial-advisor?user_id=...&language=...`.

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`.  
In the code, API base is `http://localhost:8000` for the main backend and `http://localhost:8001` for the advisor; change if you use different hosts/ports.

---

## Env / config

- **Backend**  
  - `MONGO_URI` – MongoDB connection string.  
  - `GOOGLE_API_KEY` – For Gemini (portfolio analyze). If missing or quota exceeded, `/analyze` will fail with a clear error.

- **Backend-advisor**  
  - Whatever the advisor agent and DB need (see `backend-advisor/.env` and its readme).

- **Frontend**  
  - Optional: `VITE_API_BASE_URL` for the main backend URL (defaults to `http://localhost:8000`).  
  - Advisor URL is hardcoded in `AiAdvisor.jsx` (e.g. `localhost:8001`); change there if needed.

---

## Project layout (summary)

```
Hackathon/
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── api/auth.js       # login, signup, user, transfer, addFunds, payBill
│   │   ├── components/       # Sidebar, DashboardTopbar, AuthLayout
│   │   └── pages/            # Landing, Login, Signup, user_dashboard, editProfile,
│   │                         # VoiceAssistant, AiAdvisor, Transactions
│   └── package.json
├── backend/                  # FastAPI + MongoEngine
│   ├── main.py               # All routes (auth, user, voice, analyze, transfer, etc.)
│   ├── models/               # User, financial_report (Holding, PortfolioRequest)
│   ├── agent_wealth/         # WealthManagementAgent (CrewAI + Gemini)
│   ├── voice/                # transcribe, process_command, text_to_speech
│   └── requirements.txt
├── backend-advisor/          # FastAPI, separate service
│   ├── main.py               # /financial-advisor, /voice-output, /voice-financial-advisor
│   ├── agent/                # run_financial_agent, memory, planner, etc.
│   ├── voice/tts.py
│   └── models/users.py
└── README.md
```

---

## Test user
Backend exposes `GET /create-test-user` to create a test user (e.g. username `testuser`) if you don’t want to sign up from the UI. Use it once; then log in with that user.

---

## Notes
- **Gemini quota:** Portfolio analyze uses Gemini (e.g. free tier). If you hit rate limits (429), you’ll see an error; wait or upgrade the plan.
- **CORS:** Backend allows all origins; tighten for production.
- **Security:** Passwords are hashed with bcrypt; do not put real secrets in the repo. Use env vars and proper production config for DB and API keys.
