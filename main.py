import sqlite3
import json
from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
from dotenv import load_dotenv
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.sqlite import SqliteSaver

# Import our custom logic
from graph.state import ProjectState
from agents.planner import planner_agent
from agents.reviewer import reviewer_agent

load_dotenv()
app = FastAPI(title="A.X.O.N. Brain API")

# --- 1. PERSISTENCE ---
# check_same_thread=False is essential for local "bare metal" SQLite execution
conn = sqlite3.connect("axon_memory.db", check_same_thread=False)
memory = SqliteSaver(conn)


# --- 2. REQUEST MODELS ---
class StartProjectRequest(BaseModel):
    goal: str
    thread_id: str = "project_001"


class ChatRequest(BaseModel):
    message: str


# --- 3. LANGGRAPH NODES ---
def plan_node(state: ProjectState):
    print(f"\n⚙️ [NODE: PLANNER] Decomposing goal: {state.get('goal', 'Analyze Code')}")
    response = planner_agent.run(state.get('goal', 'Analyze Code'))

    raw_output = response.content.strip()
    print(f"--- RAW AI OUTPUT ---\n{raw_output}\n---------------------")

    try:
        # Clean up any potential markdown formatting from LLM
        raw_output = raw_output.replace("```json", "").replace("```", "").strip()
        plan_data = json.loads(raw_output)
        tasks = plan_data.get("tasks", [])

        # We return both 'tasks' for internal state and 'planned_tasks' for the final webhook response
        return {
            "tasks": tasks,
            "planned_tasks": tasks,
            "review_status": "PENDING"
        }
    except Exception as e:
        print(f"❌ JSON Parse Error in Planner: {e}")
        return {"tasks": [], "planned_tasks": []}


def reviewer_node(state: ProjectState):
    """
    The AI Reviewer compares the GitHub diff against assigned tasks.
    If misaligned, it triggers a FAIL status to prompt an n8n email warning.
    """
    diff_content = state.get("latest_pr_diff", "")
    planned_tasks = state.get("planned_tasks", [])

    # Identify the current target task (the first one not yet COMPLETED)
    # This ensures the AI knows exactly what the dev SHOULD be working on
    current_task = next((t for t in planned_tasks if t.get('status') != 'COMPLETED'), None)

    print(
        f"🧠 [NODE: REVIEWER] Analyzing alignment for Task: {current_task.get('title') if current_task else 'General'}")

    if not diff_content or diff_content == "No diff provided":
        return {
            "review_status": "EMPTY",
            "feedback": "⚠️ No code changes detected in the push."
        }

    # Enhanced prompt to check for task alignment and project drift
    review_prompt = f"""
    You are the Senior Code Reviewer for A.X.O.N. Your goal is to ensure the team stays on track.

    ASSIGNED ROADMAP:
    {json.dumps(planned_tasks, indent=2)}

    CURRENT TARGET TASK:
    Title: {current_task.get('title') if current_task else 'N/A'}
    Description: {current_task.get('description') if current_task else 'N/A'}

    CODE DIFF RECEIVED:
    {diff_content}

    STRICT REVIEW CRITERIA:
    1. ALIGNMENT: Does this code directly contribute to the CURRENT TARGET TASK?
    2. DRIFT: If the developer is working on something not assigned, you MUST FAIL the review.
    3. QUALITY: Check for bugs, security issues, or unfinished logic.

    You MUST respond ONLY with a valid JSON object:
    {{
        "review_status": "PASS" or "FAIL",
        "feedback": "Be specific. If failing, explain why the code doesn't match the assigned task."
    }}
    """

    # Running the agent with the new alignment-focused prompt
    response = reviewer_agent.run(review_prompt)
    raw_output = response.content.strip()

    try:
        clean_json = raw_output.replace("```json", "").replace("```", "").strip()
        review_data = json.loads(clean_json)

        status = review_data.get("review_status", "FAIL")
        feedback = review_data.get("feedback", "Automated parsing failed.")

    except Exception as e:
        print(f"❌ JSON Parse Error in Reviewer: {e}")
        status = "FAIL"
        feedback = "System error: The AI returned an invalid response format."

    print(f"✅ Analysis Result: {status}")

    # The return values here trigger your n8n workflows:
    # 'FAIL' status will cause n8n to send the feedback email to the developer.
    return {"review_status": status, "feedback": feedback}

# --- 4. CONDITIONAL ROUTING ---
def check_review_status(state: ProjectState) -> str:
    # Routes based on review status
    if state.get("review_status") == "PASS":
        return "complete"
    else:
        return "rework"


# --- 5. BUILD THE GRAPH ---
builder = StateGraph(ProjectState)

builder.add_node("planner", plan_node)
builder.add_node("reviewer", reviewer_node)

builder.set_entry_point("planner")
builder.add_edge("planner", "reviewer")

builder.add_conditional_edges(
    "reviewer",
    check_review_status,
    {
        "complete": END,
        "rework": END  # We end at rework so n8n can process the current failure state
    }
)

axon_brain = builder.compile(checkpointer=memory)


# --- 6. FASTAPI ROUTES ---

@app.post("/api/start")
async def start_project(request: StartProjectRequest):
    """
    Step 1 of End-to-End Test: Planning.
    Assigns the project goal and generates the roadmap.
    """
    config = {"configurable": {"thread_id": request.thread_id}}

    # Run only the planner node to set the roadmap in memory
    print(f"🚀 Initializing Project: {request.goal}")
    axon_brain.invoke({"goal": request.goal}, config)

    current_state = axon_brain.get_state(config)
    tasks = current_state.values.get("planned_tasks", [])

    return {
        "message": "Project initialized and roadmap generated.",
        "tasks": tasks
    }


@app.post("/api/webhook/github-pr")
async def handle_pr_webhook(pr_data: dict, thread_id: str = "project_001"):
    """
    Step 2 of End-to-End Test: Execution.
    Triggered when a PR is uploaded.
    """
    config = {"configurable": {"thread_id": thread_id}}

    initial_state = {
        "goal": pr_data.get("pull_request", {}).get("title", "Analyze Code"),
        "latest_pr_diff": pr_data.get("diff", "No diff provided")
    }

    # Run the full graph (Planning check + Review)
    axon_brain.invoke(initial_state, config)

    # Fetch results from persistence
    final_state = axon_brain.get_state(config)

    return {
        "status": final_state.values.get("review_status"),
        "feedback": final_state.values.get("feedback"),
        "tasks": final_state.values.get("planned_tasks", []),
        "pr_id": pr_data.get("pr_id", "Unknown")
    }


@app.post("/api/chat")
async def leader_summary_trigger(request: ChatRequest):
    """
    Step 3 of Demo: Team Leader Update.
    Manually triggers a report based on the state stored in memory.
    """
    user_message = request.message.lower()

    if any(word in user_message for word in ["update", "summary", "report", "status"]):
        # Grab the latest context from project_001 thread
        config = {"configurable": {"thread_id": "project_001"}}
        latest_state = axon_brain.get_state(config)

        review_status = latest_state.values.get("review_status", "N/A")
        feedback = latest_state.values.get("feedback", "No recent activity found.")
        tasks = latest_state.values.get("planned_tasks", [])

        ai_summary = (
            "🤖 **A.X.O.N. Leader Briefing:**\n\n"
            f"📡 **Latest PR Status:** {review_status}\n"
            f"📝 **Review Feedback:** {feedback}\n\n"
            "📍 **Original Planned Tasks:**\n"
        )

        for task in tasks[:4]:  # Show first 4 for brevity
            ai_summary += f"• {task['title']}\n"

        return {
            "reply": ai_summary,
            "trigger_email": True,
            "underperformers": [
                {
                    "name": "Development Team",
                    "email": "ravindrakumarsingh9956829182@gmail.com",
                    "issue": feedback,
                    "tasks": tasks
                }
            ]
        }

    return {"reply": "I am standing by. Ask for a 'report' to see project health."}


if __name__ == "__main__":
    import uvicorn

    # 0.0.0.0 allows other devices on the same network to hit the API if needed
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)