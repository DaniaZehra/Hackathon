def reason_about_state(state):
    priorities = []

    # Low balance warning if less than 20% of total spent
    if state["balance"] < state["total_spent"] * 0.2:
        priorities.append("LOW_BALANCE")

    # Check if any category is unusually high (simple threshold)
    for cat, amt in state["category_spending"].items():
        if amt > state["total_spent"] * 0.5:  # more than 50% of spending
            priorities.append(f"HIGH_SPENDING_{cat.upper()}")

    return priorities
