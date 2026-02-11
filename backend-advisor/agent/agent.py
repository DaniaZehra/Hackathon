from .perception import observe_finances
from .reasoning import reason_about_state
from .planner import plan_actions
from .actions import execute_actions
from .llm_explainer import explain_with_llm
from .memory import update_memory, get_user_memory
from models.users import User

def run_financial_agent(user_id, language="en"):
    user = User.objects(id=user_id).first()
    if not user:
        return "User not found", []

    # Observe user finances
    state = observe_finances(
        transactions=user.transaction_history,  # MongoDB list of dicts
        balance=user.balance
    )

    # Reason and plan actions
    priorities = reason_about_state(state)
    actions = plan_actions(priorities)
    messages = execute_actions(actions, state)
    final_text = explain_with_llm(messages, language)
    update_memory(user_id, actions, final_text)
    past_history = get_user_memory(user_id)

    return final_text, actions, past_history
