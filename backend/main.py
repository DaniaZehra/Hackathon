from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from agent_wealth.agent import WealthManagementAgent
from models.financial_report import Holding, PortfolioRequest, AnalysisResponse
import io
import os
from datetime import datetime

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
    return {"message": "Banking Application running ✅"}


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


class TransferRequest(BaseModel):
    recipient_name: str
    account_id: str
    amount: float
    purpose: str


class AddFundsRequest(BaseModel):
    amount: float
    source: str  # 'debit_card' | 'credit_card' | 'bank_transfer'
    purpose: str | None = None
    cardholder_name: str | None = None
    card_number: str | None = None
    expiry_date: str | None = None
    cvv: str | None = None
    bank_name: str | None = None
    bank_account: str | None = None


class PayBillRequest(BaseModel):
    category: str  # electricity, gas, water, internet, mobile
    reference_number: str
    provider: str | None = None
    amount: float
    account_source: str  # savings, current

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
            "monthly_spends": user.monthly_spends,
            "daily_avg_spend": user.daily_avg_spend,
            "transaction_history": user.transaction_history,
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
            "monthly_spends": user.monthly_spends,
            "daily_avg_spend": user.daily_avg_spend,
            "transaction_history": user.transaction_history,
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
            transaction_history=[],
            agent_history=[]
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

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_portfolio(request: PortfolioRequest):
    
    try:
        portfolio_data = [holding.model_dump() for holding in request.holdings]
        
      
        result = WealthManagementAgent().run(portfolio_data)
        
        return AnalysisResponse(
            status="success",
            report=str(result)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent Execution Error: {str(e)}")
    
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


@app.post("/user/{username}/transfer")
def send_money(username: str, payload: TransferRequest):
    user = User.objects(username=username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    amount = float(payload.amount)
    if amount < 100 or amount > 20000:
        raise HTTPException(status_code=400, detail="Amount must be between 100 and 20000 PKR")

    fee = 50.0  # Flat transfer fee in PKR
    total = amount + fee

    if user.balance < total:
        raise HTTPException(status_code=400, detail="Insufficient balance for this transfer")

    # Update balances and spends
    user.balance = (user.balance or 0) - total
    user.monthly_spends = (user.monthly_spends or 0) + amount
    user.daily_avg_spend = user.monthly_spends / 30.0

    transaction = {
        "recipient_name": payload.recipient_name,
        "account_id": payload.account_id,
        "amount": amount,
        "fee": fee,
        "total": total,
        "purpose": payload.purpose,
        "type": "debit",
        "created_at": datetime.utcnow().isoformat() + "Z",
    }

    if user.transaction_history is None:
        user.transaction_history = []
    user.transaction_history.append(transaction)

    user.save()

    return {
        "message": "Transfer successful",
        "user": {
            "id": str(user.id),
            "firstname": user.firstname,
            "lastname": user.lastname,
            "username": user.username,
            "balance": user.balance,
            "monthly_spends": user.monthly_spends,
            "daily_avg_spend": user.daily_avg_spend,
            "transaction_history": user.transaction_history,
        },
        "transaction": transaction,
        "fee": fee,
        "total": total,
    }


@app.post("/user/{username}/add-funds")
def add_funds(username: str, payload: AddFundsRequest):
    user = User.objects(username=username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    amount = float(payload.amount)
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than 0")

    # Very simple validation by source type
    if payload.source in ("debit_card", "credit_card"):
        if not payload.cardholder_name or not payload.card_number or not payload.expiry_date or not payload.cvv:
            raise HTTPException(status_code=400, detail="Card details are required for card funding")
    elif payload.source == "bank_transfer":
        if not payload.bank_name or not payload.bank_account:
            raise HTTPException(status_code=400, detail="Bank name and account number are required")

    user.balance = (user.balance or 0) + amount
    # For now we do not touch monthly_spends / daily_avg_spend when adding funds.

    transaction = {
        "amount": amount,
        "fee": 0.0,
        "total": amount,
        "purpose": payload.purpose or "add_funds",
        "type": "credit",
        "source": payload.source,
        "created_at": datetime.utcnow().isoformat() + "Z",
    }

    if payload.source in ("debit_card", "credit_card"):
        transaction["cardholder_name"] = payload.cardholder_name
        transaction["last4"] = payload.card_number[-4:] if payload.card_number else None
    elif payload.source == "bank_transfer":
        transaction["bank_name"] = payload.bank_name
        transaction["bank_account"] = payload.bank_account

    if user.transaction_history is None:
        user.transaction_history = []
    user.transaction_history.append(transaction)

    user.save()

    return {
        "message": "Funds added successfully",
        "user": {
            "id": str(user.id),
            "firstname": user.firstname,
            "lastname": user.lastname,
            "username": user.username,
            "balance": user.balance,
            "monthly_spends": user.monthly_spends,
            "daily_avg_spend": user.daily_avg_spend,
            "transaction_history": user.transaction_history,
        },
        "transaction": transaction,
    }


@app.post("/user/{username}/pay-bill")
def pay_bill(username: str, payload: PayBillRequest):
    user = User.objects(username=username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    amount = float(payload.amount)
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than 0")

    if user.balance is None or user.balance < amount:
        raise HTTPException(status_code=400, detail="Insufficient balance to pay this bill")

    # Deduct amount, update spending
    user.balance = (user.balance or 0) - amount
    user.monthly_spends = (user.monthly_spends or 0) + amount
    user.daily_avg_spend = user.monthly_spends / 30.0

    transaction = {
        "amount": amount,
        "fee": 0.0,
        "total": amount,
        "purpose": payload.category,
        "type": "debit",
        "source": payload.account_source,
        "category": payload.category,
        "reference_number": payload.reference_number,
        "provider": payload.provider,
        "created_at": datetime.utcnow().isoformat() + "Z",
    }

    if user.transaction_history is None:
        user.transaction_history = []
    user.transaction_history.append(transaction)

    user.save()

    return {
        "message": "Bill paid successfully",
        "user": {
            "id": str(user.id),
            "firstname": user.firstname,
            "lastname": user.lastname,
            "username": user.username,
            "balance": user.balance,
            "monthly_spends": user.monthly_spends,
            "daily_avg_spend": user.daily_avg_spend,
            "transaction_history": user.transaction_history,
        },
        "transaction": transaction,
    }