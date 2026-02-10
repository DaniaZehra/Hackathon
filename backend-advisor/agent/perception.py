from datetime import datetime, timedelta

def observe_finances(transactions, balance):
    # Convert all transactions to regular Python dicts
    transactions = [dict(tx) for tx in transactions]
    
    total_spent = sum(abs(tx["amount"]) for tx in transactions if tx["amount"] < 0)
    categories = {}
    
    # Calculate spending per category
    for tx in transactions:
        cat = tx.get("category", "Other")
        categories[cat] = categories.get(cat, 0) + abs(tx["amount"])
    
    # Calculate days until balance runs out (simple estimation)
    daily_avg = total_spent / 30 if transactions else 0
    days_left = balance / daily_avg if daily_avg > 0 else 30
    
    return {
        "balance": balance,
        "total_spent": total_spent,
        "transaction_count": len(transactions),
        "category_spending": categories,
        "days_left": days_left,
        "monthly_spending": categories
    }