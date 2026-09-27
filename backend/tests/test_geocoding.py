import os
import requests
from dotenv import load_dotenv

# Load API key from .env
load_dotenv()

api_key = os.getenv("ORS_API_KEY")

# Check that the key exists
if not api_key:
    print("ORS API key was not found.")
    exit()

# Test location
address = "Sector 18, Noida, Uttar Pradesh, India"

# New openrouteservice/HeiGIT geocoding endpoint
url = "https://api.heigit.org/pelias/v1/search"

params = {
    "api_key": api_key,
    "text": address,
    "size": 1
}

# Send request
response = requests.get(url, params=params)

print("Status code:", response.status_code)

# Check response
if response.status_code == 200:

    data = response.json()

    if data["features"]:

        coordinates = data["features"][0]["geometry"]["coordinates"]

        longitude = coordinates[0]
        latitude = coordinates[1]

        print("Location found successfully.")
        print("Address:", address)
        print("Latitude:", latitude)
        print("Longitude:", longitude)

    else:
        print("No location found.")

else:
    print("Geocoding request failed.")
    print(response.text)