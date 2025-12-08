
def call_claude(prompt, model):
    return {"response": f"Called Claude with prompt: {prompt}"}

def call_gpt_3_5_turbo(prompt, model):
    return {"response": f"Called GPT-3.5-Turbo with prompt: {prompt}"}

def call_gpt_4(prompt, model):
    return {"response": f"Called GPT-4 with prompt: {prompt}"}