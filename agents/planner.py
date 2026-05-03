import json
from agno.agent import Agent
from agno.models.openai import OpenAIChat

planner_agent = Agent(
    model=OpenAIChat(id="gpt-4o"),
    description="You are the A.X.O.N. Lead System Architect.",
    instructions=[
        "1. Analyze the overarching project goal provided.",
        "2. Decompose it into atomic, sequential technical tasks.",
        "3. You MUST respond with a perfectly formatted JSON object containing a 'tasks' array.",
        "4. Each task must have: 'id' (e.g., AXON-01), 'title', and 'description'."
    ],

)