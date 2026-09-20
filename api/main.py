import json
from pathlib import Path
from datetime import datetime

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel  
from fastapi.middleware.cors import CORSMiddleware
from utils.charger_distance import calculate_charger_distances

# --------------------------------
# HomeVolt API
# --------------------------------

app = FastAPI(
    title="HomeVolt API",
    description="API for HomeVolt private EV charger sharing platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------
# File paths
# --------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"


# --------------------------------
# Load JSON data
# --------------------------------

def load_json(filename):
    with open(DATA_DIR / filename, "r", encoding="utf-8") as file:
        return json.load(file)


chargers = load_json("chargers.json")
hosts = load_json("hosts.json")
locations = load_json("locations.json")
availability = load_json("availability.json")
bookings = load_json("bookings.json")


# --------------------------------
# Helper functions
# --------------------------------

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


# --------------------------------
# Basic API
# --------------------------------

@app.get("/")
def home():
    return {
        "message": "Welcome to HomeVolt API",
        "status": "running"
    }


# --------------------------------
# Get all chargers
# --------------------------------

@app.get("/chargers")
def get_chargers():

    results = []

    for charger in chargers:

        host = find_host(charger["hostId"])
        location = find_location(charger["hostId"])

        results.append({
            "charger": charger,
            "host": host,
            "location": location
        })

    return {
        "total": len(results),
        "chargers": results
    }


# --------------------------------
# Get one charger
# --------------------------------
# --------------------------------
# Search chargers by location
# --------------------------------

@app.get("/chargers/search")
def search_by_location(query: str):

    query = query.strip().lower()

    results = []

    for charger in chargers:

        host = find_host(charger["hostId"])
        location = find_location(charger["hostId"])

        if not host or not location:
            continue

        pincode = str(location.get("pincode", "")).lower()
        city = location.get("city", "").lower()
        address = location.get("address", "").lower()

        if (
            query in pincode
            or query in city
            or query in address
        ):

            results.append({
                "charger": charger,
                "host": host,
                "location": location
            })

    return {
        "query": query,
        "total": len(results),
        "chargers": results
    }
# --------------------------------
# Find chargers by distance
# --------------------------------

@app.get("/chargers/nearby")
def get_nearby_chargers(
    latitude: float,
    longitude: float
):

    charger_data = []

    for charger in chargers:

        host = find_host(charger["hostId"])
        location = find_location(charger["hostId"])

        charger_data.append({
            "charger": charger,
            "host": host,
            "location": location
        })

    results = calculate_charger_distances(
        latitude,
        longitude,
        charger_data
    )

    return {
        "userLocation": {
            "latitude": latitude,
            "longitude": longitude
        },
        "total": len(results),
        "chargers": results
    }

@app.get("/chargers/{charger_id}")
def get_charger(charger_id: str):

    for charger in chargers:

        if charger["chargerId"] == charger_id:

            host = find_host(charger["hostId"])
            location = find_location(charger["hostId"])

            charger_availability = [
                item
                for item in availability
                if item["chargerId"] == charger_id
            ]

            return {
                "charger": charger,
                "host": host,
                "location": location,
                "availability": charger_availability
            }

    raise HTTPException(
        status_code=404,
        detail="Charger not found"
    )
# --------------------------------
# Get charger availability
# --------------------------------

@app.get("/chargers/{charger_id}/availability")
def get_charger_availability(charger_id: str):

    # Check whether charger exists
    charger_exists = any(
        charger["chargerId"] == charger_id
        for charger in chargers
    )

    if not charger_exists:
        raise HTTPException(
            status_code=404,
            detail="Charger not found"
        )

    # Find availability records
    charger_schedule = [
        item
        for item in availability
        if item["chargerId"] == charger_id
    ]

    return {
        "chargerId": charger_id,
        "totalSchedules": len(charger_schedule),
        "availability": charger_schedule
    }

# --------------------------------
# Booking request model
# --------------------------------

class BookingRequest(BaseModel):
    chargerId: str
    date: str
    startTime: str
    endTime: str

    # --------------------------------
# Create a booking
# --------------------------------

@app.post("/bookings")
def create_booking(request: BookingRequest):

    # Check whether charger exists
    charger = next(
        (
            charger
            for charger in chargers
            if charger["chargerId"] == request.chargerId
        ),
        None
    )

    if charger is None:
        raise HTTPException(
            status_code=404,
            detail="Charger not found"
        )

    # Validate date and time format
    try:
        booking_date = datetime.strptime(
            request.date,
            "%Y-%m-%d"
        )

        start_time = datetime.strptime(
            request.startTime,
            "%H:%M"
        )

        end_time = datetime.strptime(
            request.endTime,
            "%H:%M"
        )

    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid date or time format"
        )

    # Make sure end time is after start time
    if end_time <= start_time:
        raise HTTPException(
            status_code=400,
            detail="End time must be after start time"
        )

    # Find day of week
    day_name = booking_date.strftime("%A")

    # Check host's availability
    schedule = None

    for item in availability:

        if (
            item["chargerId"] == request.chargerId
            and item["day"] == day_name
            and item["available"] is True
        ):
            schedule = item
            break

    if schedule is None:
        raise HTTPException(
            status_code=400,
            detail=f"Charger is not available on {day_name}"
        )

    # Convert host schedule to datetime objects
    schedule_start = datetime.strptime(
        schedule["startTime"],
        "%H:%M"
    )

    schedule_end = datetime.strptime(
        schedule["endTime"],
        "%H:%M"
    )

    # Check whether requested time fits inside schedule
    if start_time < schedule_start or end_time > schedule_end:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Requested time is outside charger availability. "
                f"Available from {schedule['startTime']} "
                f"to {schedule['endTime']}."
            )
        )

    # Check for booking conflicts
    for booking in bookings:

        if (
            booking["chargerId"] == request.chargerId
            and booking["date"] == request.date
            and booking["status"] == "confirmed"
        ):

            existing_start = datetime.strptime(
                booking["startTime"],
                "%H:%M"
            )

            existing_end = datetime.strptime(
                booking["endTime"],
                "%H:%M"
            )

            # Time overlap check
            if (
                start_time < existing_end
                and end_time > existing_start
            ):
                raise HTTPException(
                    status_code=409,
                    detail="Charger is already booked for this time"
                )

    # Create booking ID
    booking_id = f"BOOK{len(bookings) + 1:03d}"

    new_booking = {
        "bookingId": booking_id,
        "chargerId": request.chargerId,
        "date": request.date,
        "startTime": request.startTime,
        "endTime": request.endTime,
        "status": "confirmed"
    }

    # Save booking
    bookings.append(new_booking)

    with open(
        DATA_DIR / "bookings.json",
        "w",
        encoding="utf-8"
    ) as file:
        json.dump(
            bookings,
            file,
            indent=2
        )

    return {
        "message": "Booking confirmed",
        "booking": new_booking
    }

# --------------------------------
# Get all bookings
# --------------------------------

@app.get("/bookings")
def get_bookings():

    return {
        "total": len(bookings),
        "bookings": bookings
    }


# --------------------------------
# Get one booking
# --------------------------------

@app.get("/bookings/{booking_id}")
def get_booking(booking_id: str):

    for booking in bookings:

        if booking["bookingId"] == booking_id:

            return booking

    raise HTTPException(
        status_code=404,
        detail="Booking not found"
    )