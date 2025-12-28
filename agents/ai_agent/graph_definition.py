from typing import TypedDict, Any, Literal, List, Dict
from langgraph.graph import StateGraph, START, END
import json
import os
import re

from pymongo import MongoClient
from langgraph.checkpoint.mongodb import MongoDBSaver
from simpleeval import simple_eval

from .prompts import REACT_AGENT_PROMPT
from ..model_connectors.call_model import (
    call_claude,
    call_gpt_3_5_turbo,
    call_gpt_4,
)

# ============================================================
# Model Configuration & Tooling
# ============================================================

def load_models_config() -> Dict[str, dict]:
    """Load supported LLM metadata from models.json."""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(base_dir, "models.json")

    if not os.path.exists(file_path):
        raise FileNotFoundError("models.json is missing")

    with open(file_path, "r") as f:
        models_list = json.load(f)

    return {m["id"]: m for m in models_list}


def execute_tool(tool_name: str, tool_input: str) -> str:
    """
    Execute a supported tool and return its observation.
    This function represents the 'Act' capability of the agent.
    """
    if tool_name == "get_weather":
        return f"The weather in {tool_input} is Sunny, 25°C."

    if tool_name == "calculator":
        try:
            return str(simple_eval(tool_input))
        except Exception:
            return "Error evaluating expression."

    return f"Unknown tool: {tool_name}"

# ============================================================
# Agent State Definition
# ============================================================

class AgentState(TypedDict):
    """
    Persistent state for the ReAct agent.
    - messages: long-term conversational memory
    - scratchpad: short-term reasoning trace for current turn
    """
    messages: List[Dict[str, str]]
    prompt: str
    model: str | None
    response: Any | None
    metadata: Dict[str, Any]

    scratchpad: List[str]
    current_action: str | None
    current_action_input: str | None

# ============================================================
# Graph Nodes
# ============================================================

def setup_node(state: AgentState) -> AgentState:
    """
    Initialize required state fields and append the user prompt
    to message history if it is new.
    """
    state.setdefault("messages", [])
    state.setdefault("metadata", {})
    state.setdefault("scratchpad", [])

    if state.get("prompt"):
        last = state["messages"][-1] if state["messages"] else None
        if not last or last["content"] != state["prompt"]:
            state["messages"].append(
                {"role": "user", "content": state["prompt"]}
            )

    return state


def auto_model_selection(state: AgentState) -> AgentState:
    """
    Select an appropriate model based on prompt complexity
    and estimated context size.
    """
    config = load_models_config()
    text = state["prompt"] or ""

    est_tokens = len(text) / 4
    is_complex = any(
        k in text.lower()
        for k in ["code", "python", "debug", "math", "analysis", "json", "function"]
    )

    if is_complex:
        state["model"] = "gpt-4-turbo"
        state["metadata"]["selection_reason"] = "complexity"
    elif est_tokens > 10000:
        state["model"] = "claude-3-opus"
        state["metadata"]["selection_reason"] = "large_context"
    else:
        state["model"] = "gpt-3.5-turbo"
        state["metadata"]["selection_reason"] = "simple_query"

    if state["model"] not in config:
        state["model"] = list(config.keys())[0]

    return state


def reason_node(state: AgentState) -> AgentState:
    """
    Core reasoning step.
    The model decides whether to act (use a tool)
    or produce a final answer.
    """
    model_id = state["model"]

    tools_description = """
    - get_weather: Fetch weather for a city
    - calculator: Evaluate a math expression
    """

    system_prompt = REACT_AGENT_PROMPT.format(
        tool_descriptions=tools_description,
        model_name=model_id,
        preference=state["metadata"].get("selection_reason", "auto"),
    )

    history = ""
    for msg in state["messages"][:-1]:
        role = "User" if msg["role"] == "user" else "AI"
        history += f"{role}: {msg['content']}\n"

    scratchpad = "\n".join(state["scratchpad"])

    final_prompt = f"""
{system_prompt}

### CONVERSATION HISTORY
{history}

### USER QUERY
{state['prompt']}

### SCRATCHPAD
{scratchpad}

Respond using:
- Action / Action Input
OR
- Final Answer
"""

    if model_id == "claude-3-opus":
        result = call_claude(final_prompt, model_id)
    elif model_id == "gpt-4-turbo":
        result = call_gpt_4(final_prompt, model_id)
    else:
        result = call_gpt_3_5_turbo(final_prompt, model_id)

    state["response"] = result["response"]
    state["scratchpad"].append(state["response"])

    return state


def act_node(state: AgentState) -> AgentState:
    """
    Parse the model output to determine which tool to call.
    """
    text = state["response"]

    action = re.search(r"Action:\s*(.*)", text)
    action_input = re.search(r"Action Input:\s*(.*)", text)

    state["current_action"] = action.group(1).strip() if action else None
    state["current_action_input"] = (
        action_input.group(1).strip() if action_input else None
    )

    return state


def observe_node(state: AgentState) -> AgentState:
    """
    Execute the chosen tool and store its observation
    in the scratchpad for the next reasoning step.
    """
    if state.get("current_action"):
        result = execute_tool(
            state["current_action"],
            state["current_action_input"],
        )
        state["scratchpad"].append(f"Observation: {result}")
    else:
        state["scratchpad"].append("Observation: No valid action detected")

    return state


def finalize_node(state: AgentState) -> AgentState:
    """
    Extract the final answer and persist it
    as part of the conversation history.
    """
    text = state["response"]

    final_answer = (
        text.split("Final Answer:")[-1].strip()
        if "Final Answer:" in text
        else text
    )

    state["messages"].append(
        {"role": "assistant", "content": final_answer}
    )

    return state

# ============================================================
# Graph Control Logic
# ============================================================

def check_condition(state: AgentState) -> Literal["reason", "auto_model_selection"]:
    """Route based on whether the user explicitly selected a model."""
    allowed = load_models_config()
    return "reason" if state.get("model") in allowed else "auto_model_selection"


def should_continue(state: AgentState) -> Literal["act", "finalize"]:
    """
    Decide whether the agent should act (tool call)
    or finish the reasoning loop.
    """
    text = state["response"]

    if "Final Answer:" in text:
        return "finalize"
    if "Action:" in text:
        return "act"
    return "finalize"

# ============================================================
# Graph Construction
# ============================================================

graph = StateGraph(AgentState)

graph.add_node("setup", setup_node)
graph.add_node("auto_model_selection", auto_model_selection)
graph.add_node("reason", reason_node)
graph.add_node("act", act_node)
graph.add_node("observe", observe_node)
graph.add_node("finalize", finalize_node)

graph.add_edge(START, "setup")

graph.add_conditional_edges("setup", check_condition, {
    "auto_model_selection": "auto_model_selection",
    "reason": "reason",
})
graph.add_edge("auto_model_selection", "reason")

graph.add_conditional_edges("reason", should_continue, {
    "act": "act",
    "finalize": "finalize",
})

graph.add_edge("act", "observe")
graph.add_edge("observe", "reason")
graph.add_edge("finalize", END)

# ============================================================
# Checkpointer & App
# ============================================================

client = MongoClient(os.getenv("MONGO_URI"))
checkpointer = MongoDBSaver(client)

app = graph.compile(checkpointer=checkpointer)
