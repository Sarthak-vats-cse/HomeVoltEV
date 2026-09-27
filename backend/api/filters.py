# Filter chargers by connector type
def filter_by_connector(chargers, connector_type):
    results = []

    for charger in chargers:
        if charger["connectorType"].lower() == connector_type.lower():
            results.append(charger)

    return results


# Filter chargers by maximum price
def filter_by_price(chargers, max_price):
    results = []

    for charger in chargers:
        if charger["pricePerHour"] <= max_price:
            results.append(charger)

    return results


# Filter chargers by minimum charging speed
def filter_by_speed(chargers, min_speed):
    results = []

    for charger in chargers:
        if charger["chargingSpeed"] >= min_speed:
            results.append(charger)

    return results


# Filter chargers by availability
def filter_by_availability(chargers):
    results = []

    for charger in chargers:
        if charger["available"] is True:
            results.append(charger)

    return results


# Apply multiple filters together
def search_chargers(
    chargers,
    connector_type=None,
    max_price=None,
    min_speed=None,
    available_only=False
):
    results = []

    for charger in chargers:

        if connector_type is not None:
            if charger["connectorType"].lower() != connector_type.lower():
                continue

        if max_price is not None:
            if charger["pricePerHour"] > max_price:
                continue

        if min_speed is not None:
            if charger["chargingSpeed"] < min_speed:
                continue

        if available_only:
            if charger["available"] is not True:
                continue

        results.append(charger)

    return results