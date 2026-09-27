
import json
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError


def get_pincode_coordinates(pincode: str):
    """
    Find approximate coordinates for an Indian PIN code
    using OpenStreetMap's Nominatim geocoding service.

    Returns:
        {"latitude": float, "longitude": float}
        or None if no location is found.
    """

    pincode = str(pincode).strip()

    # Validate Indian PIN code format.
    if not pincode.isdigit() or len(pincode) != 6:
        return None

    params = urlencode({
        "postalcode": pincode,
        "country": "India",
        "format": "jsonv2",
        "limit": 1,
    })

    url = (
        "https://nominatim.openstreetmap.org/search?"
        + params
    )

    request = Request(
        url,
        headers={
            "User-Agent": "HomeVoltEV/1.0"
        },
    )

    try:
        with urlopen(request, timeout=10) as response:
            data = json.loads(
                response.read().decode("utf-8")
            )

        if not data:
            return None

        return {
            "latitude": float(data[0]["lat"]),
            "longitude": float(data[0]["lon"]),
        }

    except (HTTPError, URLError, TimeoutError, ValueError, KeyError):
        return None