
from api.auth import router as auth_router
from api.pincode_geocoding import get_pincode_coordinates

import json
from pathlib import Path
from datetime import datetime, timedelta, timezone
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from threading import Lock
from typing import Literal
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

app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
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
    file_path = DATA_DIR / filename

    if not file_path.exists():
        return []

    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)


def save_json(filename, data):
    file_path = DATA_DIR / filename

    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=2, ensure_ascii=False)


chargers = load_json("chargers.json")
hosts = load_json("hosts.json")
locations = load_json("locations.json")
availability = load_json("availability.json")
bookings = load_json("bookings.json")
subscriptions = load_json("subscriptions.json")


# --------------------------------
# Helper functions
# --------------------------------

def find_host(host_id):
    for host in hosts:
        if host["hostId"] == host_id:
            return {
    key: value
    for key, value in host.items()
    if key not in ("phone", "email")
}
    return None


def find_location(host_id):
    for location in locations:
        if location["hostId"] == host_id:
            return location
    return None


def build_charger_data():
    """Build charger records with host and location details."""
    charger_data = []

    for charger in chargers:
        host = find_host(charger["hostId"])
        location = find_location(charger["hostId"])

        if not host or not location:
            continue

        charger_data.append({
            "charger": charger,
            "host": host,
            "location": location
        })

    return charger_data


def get_location_coordinates(location):
    """Extract coordinates from a location record."""
    latitude = location.get("latitude", location.get("lat"))
    longitude = location.get("longitude", location.get("lon"))

    if latitude is None or longitude is None:
        return None

    try:
        return {
            "latitude": float(latitude),
            "longitude": float(longitude)
        }
    except (TypeError, ValueError):
        return None


def get_exact_pincode_results(pincode):
    """Find chargers whose location has the requested PIN code."""
    results = []

    for item in build_charger_data():
        location = item["location"]

        if str(location.get("pincode", "")).strip() == pincode:
            results.append(item)

    return results


def find_nearest_chargers(latitude, longitude):
    """Return chargers sorted by distance from the given coordinates."""
    charger_data = build_charger_data()

    return calculate_charger_distances(
        latitude,
        longitude,
        charger_data
    )


def search_pincode(pincode):
    """
    Search for chargers by PIN code.

    If no exact match exists, geocode the PIN code and return
    chargers sorted by distance from the approximate location.
    """
    pincode = str(pincode).strip()

    if not pincode.isdigit() or len(pincode) != 6:
        raise HTTPException(
            status_code=400,
            detail="Please enter a valid 6-digit Indian PIN code."
        )

    # Exact PIN-code match
    exact_results = get_exact_pincode_results(pincode)

    if exact_results:
        coordinates = None

        for item in exact_results:
            coordinates = get_location_coordinates(item["location"])

            if coordinates:
                break

        if coordinates:
            results = calculate_charger_distances(
                coordinates["latitude"],
                coordinates["longitude"],
                exact_results
            )
        else:
            results = exact_results

        return {
            "query": pincode,
            "searchType": "exact_pincode",
            "fallback": False,
            "message": "Chargers found for this PIN code.",
            "total": len(results),
            "chargers": results
        }

    # No exact match: geocode the PIN code
    coordinates = get_pincode_coordinates(pincode)

    if coordinates is None:
        return {
            "query": pincode,
            "searchType": "pincode_not_found",
            "fallback": False,
            "message": (
                "No chargers were found for this PIN code, "
                "and its location could not be determined."
            ),
            "total": 0,
            "chargers": []
        }

    
    results = find_nearest_chargers(
        coordinates["latitude"],
        coordinates["longitude"]
    )

    # Maximum nearby search radius in kilometres
    MAX_DISTANCE_KM = 50
    MAX_RESULTS = 4

    results = [
        item for item in results
        if item["distanceKm"] <= MAX_DISTANCE_KM
    ][:MAX_RESULTS]


    return {
        "query": pincode,
        "searchType": "nearest_pincode",
        "fallback": True,
        "message": (
            "No chargers were found for this PIN code. "
            "Showing the nearest available chargers."
        ),
        "userLocation": coordinates,
        "total": len(results),
        "chargers": results
    }


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
    results = build_charger_data()

    return {
        "total": len(results),
        "chargers": results
    }


# --------------------------------
# Search chargers by location or PIN
# --------------------------------

@app.get("/chargers/search")
def search_by_location(query: str):
    query = query.strip()
    normalized_query = query.lower()

    # PIN-code search
    if query.isdigit() and len(query) == 6:
        return search_pincode(query)

    # City, area, or address search
    results = []

    for item in build_charger_data():
        location = item["location"]

        pincode = str(location.get("pincode", "")).lower()
        city = str(location.get("city", "")).lower()
        address = str(location.get("address", "")).lower()

        if (
            normalized_query in pincode
            or normalized_query in city
            or normalized_query in address
        ):
            results.append(item)

    return {
        "query": query,
        "searchType": "location",
        "fallback": False,
        "total": len(results),
        "chargers": results
    }


# --------------------------------
# Dedicated PIN-code search
# --------------------------------

@app.get("/chargers/search-pincode")
def search_by_pincode(pincode: str):
    return search_pincode(pincode)


# --------------------------------
# Find chargers by distance
# --------------------------------

@app.get("/chargers/nearby")
def get_nearby_chargers(latitude: float, longitude: float):
    results = find_nearest_chargers(latitude, longitude)

    return {
        "userLocation": {
            "latitude": latitude,
            "longitude": longitude
        },
        "total": len(results),
        "chargers": results
    }


# --------------------------------
# Get one charger
# --------------------------------

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
    charger_exists = any(
        charger["chargerId"] == charger_id
        for charger in chargers
    )

    if not charger_exists:
        raise HTTPException(
            status_code=404,
            detail="Charger not found"
        )

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

    if end_time <= start_time:
        raise HTTPException(
            status_code=400,
            detail="End time must be after start time"
        )

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

    schedule_start = datetime.strptime(
        schedule["startTime"],
        "%H:%M"
    )

    schedule_end = datetime.strptime(
        schedule["endTime"],
        "%H:%M"
    )

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

    bookings.append(new_booking)

    # Save booking
    save_json("bookings.json", bookings)

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


# ================================================
# HOMЕVOLT PRO SUBSCRIPTION SYSTEM
# Simulated payment only - no real money is charged
# ================================================

SUBSCRIPTION_PRICE = 399
SUBSCRIPTION_CURRENCY = "INR"
SUBSCRIPTION_PLAN = "HomeVolt Pro"
SUBSCRIPTION_DURATION_DAYS = 30

PAYMENT_METHODS = {
    "upi": "UPI",
    "card": "Credit/Debit Card",
    "credit/debit card": "Credit/Debit Card",
    "credit card": "Credit/Debit Card",
    "debit card": "Credit/Debit Card",
    "net banking": "Net Banking",
    "net_banking": "Net Banking",
    "wallet": "Wallet"
}


# --------------------------------
# Subscription request model
# --------------------------------

class SubscriptionRequest(BaseModel):
    userId: str
    paymentMethod: str


# --------------------------------
# Subscription helper functions
# --------------------------------

def find_user_subscription(user_id):
    """Find the most recent subscription for a user."""
    user_subscriptions = [
        subscription
        for subscription in subscriptions
        if subscription["userId"] == user_id
    ]

    if not user_subscriptions:
        return None

    return user_subscriptions[-1]


def get_active_subscription(user_id):
    """Return the user's active, unexpired subscription."""
    now = datetime.now(timezone.utc)

    for subscription in reversed(subscriptions):
        if subscription["userId"] != user_id:
            continue

        if subscription["status"] != "active":
            continue

        try:
            expiry = datetime.fromisoformat(
                subscription["endDate"]
            )

            if expiry.tzinfo is None:
                expiry = expiry.replace(tzinfo=timezone.utc)

            if expiry > now:
                return subscription

        except (ValueError, TypeError):
            continue

    return None


# --------------------------------
# Activate HomeVolt Pro membership
# --------------------------------

@app.post("/subscriptions/activate")
def activate_subscription(request: SubscriptionRequest):
    user_id = request.userId.strip()
    payment_method_input = request.paymentMethod.strip().lower()

    if not user_id:
        raise HTTPException(
            status_code=400,
            detail="User ID is required."
        )

    if payment_method_input not in PAYMENT_METHODS:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid payment method. Choose UPI, Card, "
                "Net Banking, or Wallet."
            )
        )

    payment_method = PAYMENT_METHODS[payment_method_input]

    # Prevent duplicate active subscriptions
    existing_subscription = get_active_subscription(user_id)

    if existing_subscription:
        return {
            "message": "You already have an active HomeVolt Pro membership.",
            "subscription": existing_subscription
        }

    now = datetime.now(timezone.utc)
    end_date = now + timedelta(days=SUBSCRIPTION_DURATION_DAYS)

    subscription_id = f"SUB-{uuid4().hex[:10].upper()}"

    new_subscription = {
        "subscriptionId": subscription_id,
        "userId": user_id,
        "plan": SUBSCRIPTION_PLAN,
        "amount": SUBSCRIPTION_PRICE,
        "currency": SUBSCRIPTION_CURRENCY,
        "billingCycle": "monthly",
        "paymentMethod": payment_method,
        "paymentStatus": "simulated_success",
        "status": "active",
        "startDate": now.isoformat(),
        "endDate": end_date.isoformat(),
        "autoRenew": False,
        "createdAt": now.isoformat()
    }

    subscriptions.append(new_subscription)

    save_json("subscriptions.json", subscriptions)

    return {
        "message": (
            "Demo payment successful! "
            "Your HomeVolt Pro membership is now active."
        ),
        "simulatedPayment": True,
        "subscription": new_subscription
    }


# --------------------------------
# Get subscription status
# --------------------------------

@app.get("/subscriptions/{user_id}")
def get_subscription_status(user_id: str):
    user_id = user_id.strip()

    if not user_id:
        raise HTTPException(
            status_code=400,
            detail="User ID is required."
        )

    subscription = find_user_subscription(user_id)

    if subscription is None:
        return {
            "userId": user_id,
            "isSubscribed": False,
            "status": "inactive",
            "message": "No subscription found for this user."
        }

    active_subscription = get_active_subscription(user_id)

    if active_subscription:
        return {
            "userId": user_id,
            "isSubscribed": True,
            "status": "active",
            "subscription": active_subscription
        }

    return {
        "userId": user_id,
        "isSubscribed": False,
        "status": subscription["status"],
        "subscription": subscription
    }


# --------------------------------
# Host registration request model
# --------------------------------

class HostRegistrationRequest(BaseModel):
    fullName: str = Field(min_length=2)
    phone: str = Field(min_length=10)
    email: str = Field(min_length=5)
    chargerName: str = Field(min_length=2)
    chargerType: Literal["AC", "DC"]
    connectorType: str = Field(min_length=1)
    chargingSpeed: float = Field(gt=0)
    address: str = Field(min_length=5)
    city: str = Field(min_length=2)
    pincode: str = Field(pattern=r"^[1-9][0-9]{5}$")
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    price: float = Field(gt=0)
    availability: str
    description: str = ""

host_registration_lock = Lock()


def generate_next_id(records, key, prefix):
    numbers = []

    for record in records:
        value = str(record.get(key, ""))

        if value.startswith(prefix):
            suffix = value[len(prefix):]

            if suffix.isdigit():
                numbers.append(int(suffix))

    next_number = max(numbers, default=0) + 1

    return f"{prefix}{next_number:03d}"


# --------------------------------
# Register a new host and charger
# --------------------------------

@app.post("/hosts/register", status_code=201)
def register_host(request: HostRegistrationRequest):

    days = [
        "Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday", "Sunday"
    ]

    # Determine availability schedule
    if request.availability == "24/7":
        selected_days = days
        start_time = "00:00"
        end_time = "23:59"

    elif request.availability == "Weekdays":
        selected_days = days[:5]
        start_time = "09:00"
        end_time = "18:00"

    elif request.availability == "Weekends":
        selected_days = days[5:]
        start_time = "09:00"
        end_time = "18:00"

    else:
        raise HTTPException(
            status_code=400,
            detail="Please select 24/7, Weekdays or Weekends."
        )

    with host_registration_lock:

        # Generate unique IDs
        host_id = generate_next_id(
            hosts, "hostId", "HOST"
        )

        charger_id = generate_next_id(
            chargers, "chargerId", "CH"
        )

        location_id = generate_next_id(
            locations, "locationId", "LOC"
        )

        # Create host record
        new_host = {
            "hostId": host_id,
            "name": request.fullName.strip(),
            "phone": request.phone.strip(),
            "email": request.email.strip(),
            "address": request.address.strip(),
            "city": request.city.strip(),
            "pincode": request.pincode,
            "verified": False
        }

        # Create charger record
        new_charger = {
            "chargerId": charger_id,
            "hostId": host_id,
            "name": request.chargerName.strip(),
            "connectorType": request.connectorType,
            "chargingType": request.chargerType,
            "chargingSpeed": request.chargingSpeed,
            "pricePerHour": request.price,
            "status": "available",
            "description": request.description
        }

        # Create location record
        new_location = {
            "locationId": location_id,
            "hostId": host_id,
            "address": request.address.strip(),
            "city": request.city.strip(),
            "pincode": request.pincode,
            "latitude": request.latitude,
            "longitude": request.longitude
        }

        # Create availability records
        new_schedules = []

        for day in selected_days:

            availability_id = generate_next_id(
                availability + new_schedules,
                "availabilityId",
                "AVL"
            )

            new_schedules.append({
                "availabilityId": availability_id,
                "chargerId": charger_id,
                "day": day,
                "startTime": start_time,
                "endTime": end_time,
                "available": True
            })

        # Prepare updated data
        updated_hosts = hosts + [new_host]
        updated_chargers = chargers + [new_charger]
        updated_locations = locations + [new_location]
        updated_availability = availability + new_schedules

        # Save records permanently
        save_json("hosts.json", updated_hosts)
        save_json("locations.json", updated_locations)
        save_json("availability.json", updated_availability)
        save_json("chargers.json", updated_chargers)

        # Update running backend data
        hosts.append(new_host)
        locations.append(new_location)
        availability.extend(new_schedules)
        chargers.append(new_charger)

        return {
            "message": "Host registered successfully!",
            "hostId": host_id,
            "chargerId": charger_id,
            "locationId": location_id,
            "totalChargers": len(chargers)
        }
