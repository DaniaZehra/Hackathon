# test_final.py
import sys
sys.path.append('.')

from models.users import User
from agent.agent import run_financial_agent

def test_full_pipeline():
    print("="*60)
    print("FINAL AGENT TEST")
    print("="*60)
    
    # Get or create test user
    user = User.objects(username="testuser").first()
    if not user:
        print("Creating test user...")
        user = User(
            firstname="Test",
            lastname="User",
            username="testuser",
            password="test123",
            balance=5000.0,
            monthly_spends=2000.0,
            daily_avg_spend=66.67,
            transaction_history=[
                {"amount": -1500, "category": "Rent", "date": "2024-01-01"},
                {"amount": -300, "category": "Food", "date": "2024-01-05"},
                {"amount": -200, "category": "Transport", "date": "2024-01-10"},
                {"amount": -800, "category": "Shopping", "date": "2024-01-15"},
                {"amount": 1000, "category": "Salary", "date": "2024-01-20"},
            ]
        )
        user.save()
    
    print(f"Testing with user: {user.username}")
    print(f"User ID: {user.id}")
    print(f"Balance: ${user.balance}")
    print(f"Transactions: {len(user.transaction_history)}")
    
    # Run agent
    try:
        print("\n" + "="*60)
        print("RUNNING FINANCIAL AGENT...")
        print("="*60)
        
        text, actions, past = run_financial_agent(str(user.id), "en")
        
        print("\n✅ AGENT SUCCESS!")
        print(f"\nGenerated Advice:")
        print("-"*40)
        print(text[:500] + "..." if len(text) > 500 else text)
        print("-"*40)
        
        print(f"\nActions Taken: {actions}")
        print(f"Past Agent Records: {len(past)}")
        
        # Check if data is separated correctly
        user.reload()  # Refresh from database
        print(f"\n📊 DATA SEPARATION:")
        print(f"Financial Transactions: {len(user.transaction_history)}")
        if hasattr(user, 'agent_history'):
            print(f"Agent History Records: {len(user.agent_history)}")
            if user.agent_history:
                print(f"Latest agent record has 'text_advice': {'text_advice' in user.agent_history[-1]}")
        
        # Verify no agent records in transaction_history
        has_agent_data_in_transactions = any(
            'text_advice' in dict(tx) for tx in user.transaction_history
        )
        print(f"Agent data in transactions: {has_agent_data_in_transactions} (should be False)")
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_full_pipeline()