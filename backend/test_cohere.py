import os
import cohere
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("COHERE_API_KEY")
print(f"Using Key: {api_key[:5]}...{api_key[-3:]}")

co = cohere.Client(api_key)

try:
    print("Attempting to chat with model='command-r-plus'...")
    response = co.chat(
        message="Hello, are you working?",
        model="command-r-plus"
    )
    print("Success! Response:", response.text)
except Exception as e:
    print("\nFAILED.")
    print("Error:", e)