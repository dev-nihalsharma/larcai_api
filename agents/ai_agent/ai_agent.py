from .graph_definition import app, AgentState
import os
import uuid
import time

def langgraph_pipeline(data: AgentState, thread_id: str = None) -> dict:
    """
    Run the LangGraph workflow.
    If thread_id is None, generate a new one (new conversation).
    """
    if not thread_id:
        thread_id = str(uuid.uuid4())

    checkpoint_ns = os.getenv("CHECKPOINT_NS", "larcai_ns")
    
    config = {
        "configurable": {
            "thread_id": thread_id,
            "checkpoint_ns": checkpoint_ns,
        }
    }

    final_state = app.invoke(data, config=config)
    
    # Return both the result AND the thread_id so the UI can save it
    return {
        "result": final_state,
        "thread_id": thread_id
    }