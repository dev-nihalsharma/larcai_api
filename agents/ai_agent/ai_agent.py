from .graph_definition import workflow, InputData

def langgraph_pipeline(data: InputData) -> InputData:
    """
    Run the LangGraph workflow for a given prompt and optional model.
    Returns the model's response object.
    """
    final_state = workflow.invoke(data)
    return final_state

