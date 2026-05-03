from agno.agent import Agent
from agno.models.openai import OpenAIChat
from tools.backend_tools import update_dashboard

reviewer_agent = Agent(
    model=OpenAIChat(id="gpt-4o-mini"),
    tools=[update_dashboard],
    description="You are a merciless Senior Code Reviewer for A.X.O.N.",
    instructions=[
        "You will be given the Original Task Description and a Code Diff from a Pull Request.",
        "1. Determine if the code completely solves the task.",
        "2. If it solves it: Output 'STATUS: PASS' and use the update_dashboard tool to mark it 'COMPLETED'.",
        "3. If it fails or is incomplete: Output 'STATUS: FAIL', provide a 1-sentence reason, and use the update_dashboard tool to mark it 'FAILED' with feedback.",
    ],

)