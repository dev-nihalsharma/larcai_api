import requests

API_KEY = "ntCGJl0L.hlrviUuNUcfK6lZluV2g5QmcGsDJ0I2q"
URL = "http://localhost:8000/agents/chat/?auto=false"

headers = {
    "X-API-KEY": API_KEY,
    "Content-Type": "application/json"
}

payload = {
    "prompt": "what is sound of cat.",
    "model": "gpt-4.1"
}

print(f"Sending request with Key: {API_KEY[:5]}...")

try:
    response = requests.post(URL, json=payload, headers=headers)

    if response.status_code == 200:
        data = response.json()
        print("\nSuccess!")
        print("AI Response:", data['results']['response'])
        print("Billing Info:", data['results']['billing'])
    else:
        print(f"Error {response.status_code}:", response.text)

except Exception as e:
    print("Connection failed:", e)
