import json
from pathlib import Path

from utils.distance import calculate_distance


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"


with open(DATA_DIR / "locations.json", "r", encoding="utf-8") as file:
    locations = json.load(file)


location1 = locations[0]
location2 = locations[1]


distance = calculate_distance(
    location1["latitude"],
    location1["longitude"],
    location2["latitude"],
    location2["longitude"]
)


print(
    f"Distance between {location1['locationId']} "
    f"and {location2['locationId']}: {distance} km"
)