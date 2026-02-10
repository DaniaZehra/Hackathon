from crewai import Crew
from .agents import (
    perception_agent,
    reasoning_agent,
    planner_agent,
    explainer_agent
)
from .tasks import (
    perception_task,
    reasoning_task,
    planning_task,
    explanation_task
)

def run_financial_crew(user_data, language):
    t1 = perception_task(perception_agent, user_data)
    t2 = reasoning_task(reasoning_agent, t1)
    t3 = planning_task(planner_agent, t2)
    t4 = explanation_task(explainer_agent, t3, language)

    crew = Crew(
        agents=[
            perception_agent,
            reasoning_agent,
            planner_agent,
            explainer_agent
        ],
        tasks=[t1, t2, t3, t4],
        verbose=True
    )

    return crew.kickoff()
