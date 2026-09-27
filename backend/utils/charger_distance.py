from utils.distance import calculate_distance


def calculate_charger_distances(
    user_latitude,
    user_longitude,
    chargers
):
    results = []

    for item in chargers:

        location = item.get("location")

        if not location:
            continue

        latitude = location.get("latitude")
        longitude = location.get("longitude")

        if latitude is None or longitude is None:
            continue

        distance = calculate_distance(
            user_latitude,
            user_longitude,
            latitude,
            longitude
        )

        results.append({
            "charger": item.get("charger"),
            "host": item.get("host"),
            "location": location,
            "distanceKm": distance
        })

    results.sort(key=lambda x: x["distanceKm"])

    return results