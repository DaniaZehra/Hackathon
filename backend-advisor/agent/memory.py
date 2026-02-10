# agent/memory.py - FIXED VERSION
from models.users import User
from datetime import datetime

def update_memory(user_id: str, actions: list, text_advice: str):
    user = User.objects(id=user_id).first()
    if user:
        record = {
            "timestamp": datetime.now().isoformat(),
            "actions": actions,
            "text_advice": text_advice
        }
        
        # Create a new field for agent_history if it doesn't exist
        if not hasattr(user, 'agent_history'):
            # Add agent_history to the user document
            user.update(set__agent_history=[record])
        else:
            # Append to existing agent_history
            user.agent_history.append(record)
        
        user.save()
        print(f"[MEMORY] Saved agent record for user {user_id}")

def get_user_memory(user_id: str):
    user = User.objects(id=user_id).first()
    if user and hasattr(user, 'agent_history'):
        return user.agent_history
    return []