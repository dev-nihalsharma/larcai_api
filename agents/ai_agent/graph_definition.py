from typing import TypedDict, Any, Literal, List, Dict
from langgraph.graph import StateGraph, START, END
import json
import os
# BOTH OPTIONS
from langgraph.checkpoint.memory import InMemorySaver 
from pymongo import MongoClient
from langgraph.checkpoint.mongodb import MongoDBSaver

# Database connection setup
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/larcai")

#loding the configs of models from json 
def load_models_config() -> Dict[str, dict]:
    file_path = "models.json"
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"{file_path} is missing. Please create it.")
    
    with open(file_path, "r") as f:
        models_list = json.load(f)
    
    # not required but for fast O(1) lookups
    return {m["id"]: m for m in models_list}


class AgentState(TypedDict):
    messages: List[Dict[str, str]]
    prompt: str
    model: str | None
    response: Any | None
    metadata: Dict[str, Any]

# NODES
def setup_node(state: AgentState) -> AgentState:
    """Initializes the state and adds the user prompt to history."""
    if "messages" not in state:
        state["messages"] = []
    if "metadata" not in state:
        state["metadata"] = {}
        
    # Add user prompt to conversation history
    if state.get("prompt"):
        state["messages"].append({"role": "user", "content": state["prompt"]})
        
    return state


def auto_model_selection(state: AgentState) -> AgentState:
    """
    Smarter auto model Selection Logic based on:
    1. Token Estimation
    2. Task Complexity (Keywords)
    """
    print("AI Router: Analyzing Request")
    config = load_models_config()
    prompt_text = state["prompt"] or ""
    
    # Estimate tokens (1 token ~= 4 chars)
    est_tokens = len(prompt_text) / 4
    
    #  Check for 'hard' keywords
    complex_keywords = ["code", "python", "debug", "math", "analysis", "json", "function"]
    is_complex = any(k in prompt_text.lower() for k in complex_keywords)
    
    selected_model = "gpt-3.5-turbo"
    reason = "default_fallback"

    if is_complex:
        selected_model = "gpt-4-turbo"
        reason = "complexity_detected_keywords"
    elif est_tokens > 10000:
        selected_model = "claude-3-opus"
        reason = "high_context_needed"
    else:
        selected_model = "gpt-3.5-turbo"
        reason = "simple_query_optimization"

    # Validation: Ensure the selected model actually exists in JSON
    if selected_model not in config:
        selected_model = list(config.keys())[0] 

    print(f"Selected: {selected_model} (Reason: {reason})")
    
    state["model"] = selected_model
    state["metadata"]["selection_reason"] = reason
    return state


def call_model(state: AgentState) -> AgentState:
    """execution"""
    model_id = state["model"]
    print(f"Executing with {model_id} ")
    response_text = f"[{model_id}]: I have processed your request '{state['prompt']}'."
    
    state["response"] = response_text
    state["messages"].append({"role": "assistant", "content": response_text})
    return state


def check_condition(state: AgentState) -> Literal["call_model", "auto_model_selection"]:
    """
    user's model choice or route it automatically.
    """
    allowed_models = load_models_config()
    user_choice = state.get("model")
    
    # If user provided a model AND it exists in our JSON config
    if user_choice and user_choice in allowed_models:
        print(f"User forced model: {user_choice} ")
        return "call_model"
    
    # Otherwise
    return "auto_model_selection"


# ----- Graph -----
graph = StateGraph(AgentState)

graph.add_node("setup", setup_node)
graph.add_node("auto_model_selection", auto_model_selection)
graph.add_node("call_model", call_model)

graph.add_edge(START, "setup")
graph.add_conditional_edges("setup", check_condition)
graph.add_edge("auto_model_selection", "call_model")
graph.add_edge("call_model", END)


# InMemorySaver for local development
# memory = InMemorySaver()
# workflow = graph.compile(checkpointer=memory)

def get_app():
    """
    Creates the app with MongoDB checkpointer.
    """
    client = MongoClient(MONGO_URI)
    db = client["agent_db"]
    checkpointer = MongoDBSaver(client)

    return graph.compile(checkpointer=checkpointer)

app = get_app()