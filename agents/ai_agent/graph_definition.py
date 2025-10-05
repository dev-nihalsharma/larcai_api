from typing import TypedDict, Any, Literal
from langgraph.graph import StateGraph, START, END

# ----- TypedDicts -----
class InputData(TypedDict):
    prompt: str
    model: str | None
    response: Any | None


def model_check(data: InputData) -> InputData:
    # You can validate prompt here if needed
    return data


def auto_model_selection(data: InputData) -> InputData:
    if not data.get("model"):
        data["model"] = "gpt-3.5-turbo" if len(data["prompt"]) < 50 else "gpt-4"
    return data


def call_model(data: InputData) -> InputData:
    if data["model"] == "gpt-3.5-turbo":
        data["response"] = "This is a response from GPT-3.5-turbo"
    elif data["model"] == "gpt-4":
        data["response"] = "This is a response from GPT-4"
    elif data["model"] == "claude":
        data["response"] = "This is a response from Claude"
    else:
        raise ValueError("Unsupported model specified.")
    return data


def check_condition(data: InputData) -> Literal["call_model", "auto_model_selection"]:
    if data.get("model") in ["gpt-3.5-turbo", "gpt-4", "claude"]:
        return "call_model"
    else:
        return "auto_model_selection"


# ----- Graph -----
graph = StateGraph(InputData)

graph.add_node("model_check", model_check)
graph.add_node("auto_model_selection", auto_model_selection)
graph.add_node("call_model", call_model)

graph.add_edge(START, "model_check")
graph.add_conditional_edges("model_check", check_condition)
graph.add_edge("auto_model_selection", "call_model")
graph.add_edge("call_model", END)

workflow = graph.compile()
