import os
import json
import boto3
from langchain_openai import AzureChatOpenAI
from langchain_aws import ChatBedrock
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

load_dotenv()


def get_model_config(model_id):
    """Load config to check for tier/provider."""
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    config_path = os.path.join(base_dir, "ai_agent/models.json")

    if not os.path.exists(config_path):
        return None

    with open(config_path, "r") as f:
        models = json.load(f)

    for m in models:
        if m["id"] == model_id:
            return m
    return None


def call_generic_model(prompt: str, model_id: str) -> dict:
    config = get_model_config(model_id)
    if not config:
        return {"response": f"Error: Model ID {model_id} not found in config."}

    provider_id = config.get("providerId")
    tier = config.get("tier")

    llm = None

    try:
        # --- 1. AZURE OPENAI (Standard & Reasoning) ---
        if provider_id in ["azure", "azureDeepSeek", "azureGrok"]:

            # Base arguments for Azure
            azure_kwargs = {
                "azure_deployment": model_id,
                "openai_api_version": os.getenv("AZURE_OPENAI_API_VERSION"),
                "azure_endpoint": os.getenv("AZURE_OPENAI_ENDPOINT"),
                "api_key": os.getenv("AZURE_OPENAI_API_KEY"),
            }
            if tier != "reasoning" and "o3" not in model_id and "o1" not in model_id:
                azure_kwargs["temperature"] = 0

            llm = AzureChatOpenAI(**azure_kwargs)

        # --- 2. AWS BEDROCK ---
        elif provider_id in ["amazonClaude", "amazonMeta", "amazonMistral", "amazonNova", "amazonDeepSeek"]:
            ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID").strip()
            SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY").strip()
            REGION = os.getenv("AWS_DEFAULT_REGION", "us-east-1")

            # 2. Create the Session explicitly
            session = boto3.Session(
                aws_access_key_id=ACCESS_KEY,
                aws_secret_access_key=SECRET_KEY,
                region_name=REGION
            )

            # 3. Create the Bedrock Client from that session
            bedrock_runtime = session.client("bedrock-runtime")
            llm = ChatBedrock(
                client=bedrock_runtime,
                model_id=model_id,
                region_name=os.getenv("AWS_DEFAULT_REGION", "us-east-1"),
                provider="anthropic" if "claude" in model_id else "meta",
            )

        # --- 3. GOOGLE GEMINI ---
        elif provider_id == "google":
            llm = ChatGoogleGenerativeAI(
                model=model_id,
                google_api_key=os.getenv("GOOGLE_API_KEY"),
                temperature=0
            )

        # --- 4. PERPLEXITY ---
        elif provider_id == "perplexity":
            from langchain_openai import ChatOpenAI
            llm = ChatOpenAI(
                model=model_id,
                api_key=os.getenv("PERPLEXITY_API_KEY"),
                base_url="https://api.perplexity.ai"
            )

        else:
            return {"response": f"Error: Provider {provider_id} not implemented."}
        response = llm.invoke(prompt)
        return {"response": response.content}

    except Exception as e:
        return {"response": f"Error calling {model_id}: {str(e)}"}
