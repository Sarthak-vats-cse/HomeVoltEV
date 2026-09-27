import json
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))

from utils.charger_distance import calculate_charger_distances

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"


def load_json(filename):
    with open(DATA_DIR / filename, "r", encoding="utf-8") as file:
        return json.load(file)


chargers = load_json("chargers.json")
hosts = load_json("hosts.json")
locations = load_json("locations.json")


def find_host(host_id):
    for host in hosts:
        if host["hostId"] == host_id:
            return host
    return None


def find_location(host_id):
    for location in locations:
        if location["hostId"] == host_id:
            return location
    return None


charger_data = []

for charger in chargers:

    charger_data.append({
        "charger": charger,
        "host": find_host(charger["hostId"]),
        "location": find_location(charger["hostId"])
    })


# Temporary user location
user_latitude = 28.6139
user_longitude = 77.2090


results = calculate_charger_distances(
    user_latitude,
    user_longitude,
    charger_data
)


print("\nHomeVolt Chargers by Distance:\n")

for item in results:

    charger = item["charger"]
    location = item["location"]

    print(
        f"{charger['chargerId']} | "
        f"{location['locationId']} | "
        f"{location['city']} | "
        f"{item['distanceKm']} km"
    )