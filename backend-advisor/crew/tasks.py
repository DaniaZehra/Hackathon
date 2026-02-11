from crewai import Task

def perception_task(agent, user_data):
    from agent.perception import observe_finances as obs_fn
    return Task(
        description=f"Analyze user data: {user_data}",
        agent=agent,
        function=lambda: obs_fn(user_data["transactions"], user_data["balance"])
    )

def reasoning_task(agent, perception_output):
    from agent.reasoning import reason_about_state as reason_fn
    return Task(
        description="Reason about financial priorities",
        agent=agent,
        function=lambda: reason_fn(perception_output)
    )

def planning_task(agent, reasoning_output):
    from agent.planner import plan_actions as plan_fn
    return Task(
        description="Plan actions based on priorities",
        agent=agent,
        function=lambda: plan_fn(reasoning_output)
    )

def explanation_task(agent, plan_output, state, language):
    from agent.actions import execute_actions as exec_fn
    from agent.llm_explainer import explain_with_llm as explain_fn
    return Task(
        description="Explain advice in user language",
        agent=agent,
        function=lambda: explain_fn(exec_fn(plan_output, state), language)
    )