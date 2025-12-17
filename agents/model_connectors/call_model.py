import os
from langchain_openai import AzureChatOpenAI
from dotenv import load_dotenv

load_dotenv()

def _get_azure_model(deployment_env_var: str):
    """
    Helper to initialize AzureChatOpenAI.
    """
    deployment_name = os.getenv(deployment_env_var)
    api_key = os.getenv("AZURE_OPENAI_API_KEY")
    endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    api_version = os.getenv("AZURE_OPENAI_API_VERSION")

    if not api_key or not endpoint or not deployment_name:
        print(f"Error: Missing Azure config for {deployment_env_var}")
        return None
    
    return AzureChatOpenAI(
        azure_deployment=deployment_name,
        openai_api_version=api_version,
        azure_endpoint=endpoint,
        api_key=api_key,
        temperature=0,
        max_retries=2
    )

def call_gpt_3_5_turbo(prompt: str, model_id: str = "gpt-3.5-turbo") -> dict:
    """
    routing this to 'gpt-4.1-mini'.
    """
    model = _get_azure_model("AZURE_DEPLOYMENT_FAST")
    if not model:
        return {"response": "Config Error: Missing AZURE_DEPLOYMENT_FAST in .env"}
    
    try:
        response = model.invoke(prompt)
        return {"response": response.content}
    except Exception as e:
        return {"response": f"Azure Error (Fast Model): {str(e)}"}

def call_gpt_4(prompt: str, model_id: str = "gpt-4-turbo") -> dict:
    """
    ROUTING UPDATE: Maps to 'gpt-4.1' (smart model).
    """
    model = _get_azure_model("AZURE_DEPLOYMENT_SMART")
    if not model:
        return {"response": "Config Error: Missing AZURE_DEPLOYMENT_SMART in .env"}

    try:
        response = model.invoke(prompt)
        return {"response": response.content}
    except Exception as e:
        return {"response": f"Azure Error (Smart Model): {str(e)}"}
def call_reasoning_model(prompt: str) -> dict:
    """
    'o3-mini' 
    """
    model = _get_azure_model("AZURE_DEPLOYMENT_REASONING")
    if not model:
        return {"response": "Config Error: Missing AZURE_DEPLOYMENT_REASONING"}
        
    try:
        response = model.invoke(prompt)
        return {"response": response.content}
    except Exception as e:
        return {"response": f"Azure Error (o3-mini): {str(e)}"}
def call_claude(prompt: str, model_id: str = "claude-3-opus") -> dict:
    return call_gpt_4(prompt, model_id)