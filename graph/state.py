from typing import List, Dict, Any, Optional
from typing_extensions import TypedDict


class ProjectState(TypedDict):
    # Core Project Data
    goal: str
    tasks: List[Dict[str, Any]]

    # Active Execution State
    current_task_id: Optional[str]
    current_task_desc: Optional[str]

    # Review Data
    latest_pr_diff: Optional[str]
    review_status: str  # "PENDING", "PASS", "FAIL"
    feedback: Optional[str]
    iteration_count: int