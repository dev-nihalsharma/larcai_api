from typing import TypedDict, Any, Literal, List, Dict
from langgraph.graph import StateGraph, START, END
import json
import os
import re
import requests


from langgraph.checkpoint.sqlite import SqliteSaver
from simpleeval import simple_eval
import sqlite3
from .prompts import REACT_AGENT_PROMPT
from ..model_connectors.call_model import (
    call_generic_model
)


WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")
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
        if not WEATHER_API_KEY:
            return "Weather service is not configured."

        city = tool_input.strip()

        try:
            url = "https://api.openweathermap.org/data/2.5/weather"
            params = {
                "q": f"{city},US",      # 👈 critical fix
                "appid": WEATHER_API_KEY,
                "units": "metric",
            }

            res = requests.get(url, params=params, timeout=10)
            res.raise_for_status()
            data = res.json()

            temp = round(data["main"]["temp"])
            desc = data["weather"][0]["description"]
            wind = data["wind"]["speed"]

            return (
                f"The current weather in {city} is {temp}°C, "
                f"{desc} with light winds."
            )

        except Exception as e:
            return "Unable to fetch current weather data."
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


# agents/ai_agent/graph_definition.py

def auto_model_selection(state: AgentState) -> AgentState:
    """
    Intelligent Router: Analyzes prompt complexity and maps to 
    Category/Tier, then selects the most cost-effective model.
    """
    config = load_models_config()
    text = state["prompt"] or ""
    complexity_score = len(text) / 500

    reasoning_keywords = [
        "analyze", "reason", "math", "code", "logic", "solve", "why",
        "prove", "derive", "calculation", "theorem"
    ]
    search_keywords = ["latest", "news", "current", "search", "find"]

    is_reasoning = any(k in text.lower() for k in reasoning_keywords)
    is_search = any(k in text.lower() for k in search_keywords)

    target_tier = "fast"

    if is_search:
        target_tier = "search"
    elif is_reasoning:
        target_tier = "reasoning"
    elif complexity_score > 5 or "difficult" in text:
        target_tier = "powerful"
    candidates = [
        m for m in config.values()
        if m.get("tier") == target_tier and m.get("enabled")
    ]
    if not candidates and target_tier == "reasoning":
        target_tier = "powerful"
        candidates = [m for m in config.values() if m.get("tier")
                      == "powerful"]
    if not candidates:
        target_tier = "fast"
        candidates = [m for m in config.values() if m.get("tier") == "fast"]
    if candidates:
        best_model = sorted(candidates, key=lambda x: x.get("cost", 999))[0]
        selected_id = best_model["id"]
        reason = f"lowest_cost_{target_tier}"
    else:
        selected_id = list(config.keys())[0]
        reason = "emergency_fallback"

    state["model"] = selected_id
    state["metadata"]["selection_reason"] = reason

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

    result = call_generic_model(final_prompt, model_id)

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
    if state.get("current_action"):
        result = execute_tool(
            state["current_action"],
            state["current_action_input"],
        )

        # 🔒 Tool output is the ONLY observation
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


conn = sqlite3.connect("checkpoints.db", check_same_thread=False)
checkpointer = SqliteSaver(conn)

app = graph.compile(checkpointer=checkpointer)
