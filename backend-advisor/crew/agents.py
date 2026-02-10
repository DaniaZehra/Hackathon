from crewai import Agent

perception_agent = Agent(
    role="Perception Agent",
    goal="Extract meaningful financial signals from raw user data",
    backstory="Observes balances, transactions, and spending patterns",
    verbose=True
)

reasoning_agent = Agent(
    role="Reasoning Agent",
    goal="Decide what financial issues matter most",
    backstory="Thinks logically about risks and priorities",
    verbose=True
)

planner_agent = Agent(
    role="Planner Agent",
    goal="Decide what actions or advice should be given",
    backstory="Chooses best next steps for the user",
    verbose=True
)

explainer_agent = Agent(
    role="Financial Explainer",
    goal="Explain advice clearly in Urdu or English",
    backstory="Expert at human-like explanations",
    verbose=True
)
