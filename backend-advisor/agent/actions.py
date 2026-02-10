# actions.py - FIXED
def generate_insight(state):
    if not state.get("monthly_spending", {}):
        return "No spending data available."
    
    top_category = max(
        state["monthly_spending"],
        key=state["monthly_spending"].get
    )
    return f"You are spending the most on {top_category}."

def trigger_alert(state):
    # Add days_left to state in perception.py
    days_left = state.get('days_left', 30)  # Default value
    return f"Your balance may run low in {int(days_left)} days."

def explain_anomaly():
    return "An unusual transaction was detected recently."

def execute_actions(actions, state):
    messages = []
    
    for act in actions:
        if act == "TRIGGER_ALERT":
            # Get low balance message from trigger_alert function
            messages.append(trigger_alert(state))
        elif act == "GENERATE_INSIGHT":
            if state.get("category_spending"):
                high_cat = max(state["category_spending"], 
                             key=state["category_spending"].get)
                messages.append(f"You are spending the most on {high_cat}.")
            else:
                messages.append("No category spending data available.")
    
    return messages