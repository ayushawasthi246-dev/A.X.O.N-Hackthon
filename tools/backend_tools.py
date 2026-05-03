import requests
from agno.tools import tool

@tool
def update_dashboard(task_id: str, status: str, feedback: str = "No feedback provided.") -> str:
    """
    Updates the project dashboard with the current task status (COMPLETED, IN_PROGRESS, or FAILED).
    Use this immediately after reviewing a task to update the human team.
    """
    print(f"\n[SYSTEM TOOL] -> Updating Dashboard | Task: {task_id} | Status: {status}")

    payload = {
        "task_id": task_id,
        "status": status,
        "feedback": feedback
    }

    # In production, this hits your teammate's Node.js server:
    # try:
    #     requests.post("http://localhost:3000/api/tasks/update", json=payload)
    # except Exception as e:
    #     return f"Failed to reach backend: {e}"

    return f"Successfully updated task {task_id} to {status}."