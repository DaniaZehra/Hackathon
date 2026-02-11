def plan_actions(priorities):
    actions = []
    for p in priorities:
        if p == "LOW_BALANCE":
            actions.append("TRIGGER_ALERT")
        elif p.startswith("HIGH_SPENDING"):
            actions.append("GENERATE_INSIGHT")
    return actions
