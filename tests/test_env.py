import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("ORS_API_KEY")

if api_key:
    print("ORS API key loaded successfully.")
else:
    print("ORS API key was not found.")