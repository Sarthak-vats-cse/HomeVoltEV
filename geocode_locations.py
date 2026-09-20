import json
import os
import time
import requests
from dotenv import load_dotenv


# --------------------------------
# Load environment variables
# --------------------------------

load_dotenv()

api_key = os.getenv("ORS_API_KEY")

if not api_key:
    print("ORS API key was not found.")
    exit()


# --------------------------------
# Load HomeVolt locations
# --------------------------------

locations_file = "data/locations.json"

with open(locations_file, "r") as file:
    locations = json.load(file)


# --------------------------------
# Geocoding function
# --------------------------------

def geocode_location(address, city, pincode):

    url = "https://api.heigit.org/pelias/v1/search"

    # First try the complete address
    queries = [
        f"{address}, {city}, {pincode}, India"
    ]

    # If the complete address is too specific,
    # try removing the first part of the address.
    # Example:
    # "Max Site Dream Homes, Sector 61, Kundli"
    # becomes:
    # "Sector 61, Kundli"
    address_parts = address.split(",", 1)

    if len(address_parts) == 2:

        broader_address = address_parts[1].strip()

        queries.append(
            f"{broader_address}, {city}, {pincode}, India"
        )

    for query in queries:

        params = {
            "api_key": api_key,
            "text": query,
            "size": 1
        }

        response = requests.get(url, params=params)

        if response.status_code != 200:
            print("Geocoding failed.")
            print("Status code:", response.status_code)
            return None, None

        data = response.json()

        if data.get("features"):

            coordinates = data["features"][0]["geometry"]["coordinates"]

            longitude = coordinates[0]
            latitude = coordinates[1]

# Make sure the result is within the expected
# Delhi NCR / Haryana region.
            if not (27.5 <= latitude <= 29.5 and 76.5 <= longitude <= 78.5):

                print("Rejected coordinates outside expected region:")
                print("Latitude:", latitude)
                print("Longitude:", longitude)

                continue

            print("Found location using:", query)

            return latitude, longitude

        print("No location found for:", query)

    return None, None


# --------------------------------
# Process every location
# --------------------------------

for location in locations:

    print()
    print("Processing:", location["locationId"])

    latitude, longitude = geocode_location(
        location["address"],
        location["city"],
        location["pincode"]
    )

    if latitude is not None and longitude is not None:

        location["latitude"] = latitude
        location["longitude"] = longitude

        print("Latitude:", latitude)
        print("Longitude:", longitude)

    else:

        print("Coordinates could not be found.")


    # Small delay between requests
    time.sleep(1)


# --------------------------------
# Save updated locations
# --------------------------------

with open(locations_file, "w") as file:

    json.dump(
        locations,
        file,
        indent=2
    )


print()
print("--------------------------------")
print("Geocoding completed.")
print("locations.json has been updated.")
print("--------------------------------")