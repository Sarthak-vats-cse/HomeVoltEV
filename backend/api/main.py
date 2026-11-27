from datetime import datetime, timedelta, timezone
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pymongo import ASCENDING, ReturnDocument
from typing import Literal

from api.auth import database, router as auth_router
from api.pincode_geocoding import get_pincode_coordinates
from utils.charger_distance import calculate_charger_distances


app = FastAPI(
    title="HomeVolt API",
    description="API for HomeVolt private EV charger sharing platform",
    version="1.0.0",
)

app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# MongoDB collections
hosts_collection = database["hosts"]
chargers_collection = database["chargers"]
locations_collection = database["locations"]
availability_collection = database["availability"]
bookings_collection = database["bookings"]
subscriptions_collection = database["subscriptions"]
counters_collection = database["counters"]


# Database indexes
hosts_collection.create_index([("hostId", ASCENDING)], unique=True)
chargers_collection.create_index([("chargerId", ASCENDING)], unique=True)
chargers_collection.create_index([("hostId", ASCENDING)])
locations_collection.create_index([("locationId", ASCENDING)], unique=True)
locations_collection.create_index([("hostId", ASCENDING)], unique=True)
availability_collection.create_index([("availabilityId", ASCENDING)], unique=True)
availability_collection.create_index([("chargerId", ASCENDING)])
bookings_collection.create_index([("bookingId", ASCENDING)], unique=True)
bookings_collection.create_index([("chargerId", ASCENDING), ("date", ASCENDING)])
subscriptions_collection.create_index([("subscriptionId", ASCENDING)], unique=True)
subscriptions_collection.create_index([("userId", ASCENDING)])


def clean_document(document):
    """Remove MongoDB's internal _id before returning JSON."""
    if document is None:
        return None

    document.pop("_id", None)
    return document


def get_records(collection, query=None):
    return [
        clean_document(item)
        for item in collection.find(query or {})
    ]


def next_id(counter_name, prefix):
    """Generate HOST001, CH001, LOC001, AVL001, BOOK001 safely."""
    counter = counters_collection.find_one_and_update(
        {"_id": counter_name},
        {"$inc": {"sequence": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )

    return f"{prefix}{counter['sequence']:03d}"


def find_host(host_id):
    host = hosts_collection.find_one({"hostId": host_id})

    if host is None:
        return None

    host = clean_document(host)

    # Do not expose a host's private phone/email in public charger searches.
    host.pop("phone", None)
    host.pop("email", None)

    return host


def find_location(host_id):
    return clean_document(
        locations_collection.find_one({"hostId": host_id})
    )


def build_charger_data():
    result = []

    for charger in get_records(chargers_collection):
        host = find_host(charger["hostId"])
        location = find_location(charger["hostId"])

        if host and location:
            result.append(
                {
                    "charger": charger,
                    "host": host,
                    "location": location,
                }
            )

    return result


def get_location_coordinates(location):
    latitude = location.get("latitude", location.get("lat"))
    longitude = location.get("longitude", location.get("lon"))

    if latitude is None or longitude is None:
        return None

    try:
        return {
            "latitude": float(latitude),
            "longitude": float(longitude),
        }
    except (TypeError, ValueError):
        return None


def find_nearest_chargers(latitude, longitude):
    return calculate_charger_distances(
        latitude,
        longitude,
        build_charger_data(),
    )


def search_pincode(pincode):
    pincode = str(pincode).strip()

    if not pincode.isdigit() or len(pincode) != 6:
        raise HTTPException(
            status_code=400,
            detail="Please enter a valid 6-digit Indian PIN code.",
        )

    exact_results = []

    for item in build_charger_data():
        if str(item["location"].get("pincode", "")).strip() == pincode:
            exact_results.append(item)

    if exact_results:
        coordinates = None

        for item in exact_results:
            coordinates = get_location_coordinates(item["location"])

            if coordinates:
                break

        results = (
            calculate_charger_distances(
                coordinates["latitude"],
                coordinates["longitude"],
                exact_results,
            )
            if coordinates
            else exact_results
        )

        return {
            "query": pincode,
            "searchType": "exact_pincode",
            "fallback": False,
            "message": "Chargers found for this PIN code.",
            "total": len(results),
            "chargers": results,
        }

    coordinates = get_pincode_coordinates(pincode)

    if coordinates is None:
        return {
            "query": pincode,
            "searchType": "pincode_not_found",
            "fallback": False,
            "message": "No chargers were found for this PIN code.",
            "total": 0,
            "chargers": [],
        }

    results = find_nearest_chargers(
        coordinates["latitude"],
        coordinates["longitude"],
    )

    results = [
        item for item in results
        if item["distanceKm"] <= 50
    ][:4]

    return {
        "query": pincode,
        "searchType": "nearest_pincode",
        "fallback": True,
        "message": "Showing the nearest available chargers.",
        "userLocation": coordinates,
        "total": len(results),
        "chargers": results,
    }


@app.get("/")
def home():
    return {
        "message": "Welcome to HomeVolt API",
        "status": "running",
        "database": "MongoDB",
    }


@app.get("/chargers")
def get_chargers():
    results = build_charger_data()

    return {
        "total": len(results),
        "chargers": results,
    }


@app.get("/chargers/search")
def search_by_location(query: str):
    query = query.strip()
    normalized_query = query.lower()

    if query.isdigit() and len(query) == 6:
        return search_pincode(query)

    results = []

    for item in build_charger_data():
        location = item["location"]

        if (
            normalized_query in str(location.get("pincode", "")).lower()
            or normalized_query in str(location.get("city", "")).lower()
            or normalized_query in str(location.get("address", "")).lower()
        ):
            results.append(item)

    return {
        "query": query,
        "searchType": "location",
        "fallback": False,
        "total": len(results),
        "chargers": results,
    }


@app.get("/chargers/search-pincode")
def search_by_pincode(pincode: str):
    return search_pincode(pincode)


@app.get("/chargers/nearby")
def get_nearby_chargers(latitude: float, longitude: float):
    results = find_nearest_chargers(latitude, longitude)

    return {
        "userLocation": {
            "latitude": latitude,
            "longitude": longitude,
        },
        "total": len(results),
        "chargers": results,
    }


@app.get("/chargers/{charger_id}")
def get_charger(charger_id: str):
    charger = clean_document(
        chargers_collection.find_one({"chargerId": charger_id})
    )

    if charger is None:
        raise HTTPException(
            status_code=404,
            detail="Charger not found",
        )

    schedules = get_records(
        availability_collection,
        {"chargerId": charger_id},
    )

    return {
        "charger": charger,
        "host": find_host(charger["hostId"]),
        "location": find_location(charger["hostId"]),
        "availability": schedules,
    }


@app.get("/chargers/{charger_id}/availability")
def get_charger_availability(charger_id: str):
    charger_exists = chargers_collection.find_one(
        {"chargerId": charger_id},
        {"_id": 1},
    )

    if charger_exists is None:
        raise HTTPException(
            status_code=404,
            detail="Charger not found",
        )

    schedules = get_records(
        availability_collection,
        {"chargerId": charger_id},
    )

    return {
        "chargerId": charger_id,
        "totalSchedules": len(schedules),
        "availability": schedules,
    }


class BookingRequest(BaseModel):
    chargerId: str
    date: str
    startTime: str
    endTime: str


@app.post("/bookings")
def create_booking(request: BookingRequest):
    charger = chargers_collection.find_one(
        {"chargerId": request.chargerId}
    )

    if charger is None:
        raise HTTPException(
            status_code=404,
            detail="Charger not found",
        )

    try:
        booking_date = datetime.strptime(request.date, "%Y-%m-%d")
        start_time = datetime.strptime(request.startTime, "%H:%M")
        end_time = datetime.strptime(request.endTime, "%H:%M")
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid date or time format",
        )

    if end_time <= start_time:
        raise HTTPException(
            status_code=400,
            detail="End time must be after start time",
        )

    day_name = booking_date.strftime("%A")

    schedule = availability_collection.find_one(
        {
            "chargerId": request.chargerId,
            "day": day_name,
            "available": True,
        }
    )

    if schedule is None:
        raise HTTPException(
            status_code=400,
            detail=f"Charger is not available on {day_name}",
        )

    schedule_start = datetime.strptime(schedule["startTime"], "%H:%M")
    schedule_end = datetime.strptime(schedule["endTime"], "%H:%M")

    if start_time < schedule_start or end_time > schedule_end:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Requested time is outside charger availability. "
                f"Available from {schedule['startTime']} "
                f"to {schedule['endTime']}."
            ),
        )

    existing_bookings = bookings_collection.find(
        {
            "chargerId": request.chargerId,
            "date": request.date,
            "status": "confirmed",
        }
    )

    for booking in existing_bookings:
        existing_start = datetime.strptime(
            booking["startTime"],
            "%H:%M",
        )
        existing_end = datetime.strptime(
            booking["endTime"],
            "%H:%M",
        )

        if start_time < existing_end and end_time > existing_start:
            raise HTTPException(
                status_code=409,
                detail="Charger is already booked for this time",
            )

    new_booking = {
        "bookingId": next_id("bookings", "BOOK"),
        "chargerId": request.chargerId,
        "date": request.date,
        "startTime": request.startTime,
        "endTime": request.endTime,
        "status": "confirmed",
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }

    bookings_collection.insert_one(new_booking)

    return {
        "message": "Booking confirmed",
        "booking": clean_document(new_booking),
    }


@app.get("/bookings")
def get_bookings():
    records = get_records(bookings_collection)

    return {
        "total": len(records),
        "bookings": records,
    }


@app.get("/bookings/{booking_id}")
def get_booking(booking_id: str):
    booking = clean_document(
        bookings_collection.find_one({"bookingId": booking_id})
    )

    if booking is None:
        raise HTTPException(
            status_code=404,
            detail="Booking not found",
        )

    return booking


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
    "wallet": "Wallet",
}


class SubscriptionRequest(BaseModel):
    userId: str
    paymentMethod: str


def get_active_subscription(user_id):
    now = datetime.now(timezone.utc)

    records = subscriptions_collection.find(
        {
            "userId": user_id,
            "status": "active",
        }
    ).sort("createdAt", -1)

    for subscription in records:
        expiry = datetime.fromisoformat(subscription["endDate"])

        if expiry.tzinfo is None:
            expiry = expiry.replace(tzinfo=timezone.utc)

        if expiry > now:
            return clean_document(subscription)

    return None


@app.post("/subscriptions/activate")
def activate_subscription(request: SubscriptionRequest):
    user_id = request.userId.strip()
    payment_method_input = request.paymentMethod.strip().lower()

    if not user_id:
        raise HTTPException(
            status_code=400,
            detail="User ID is required.",
        )

    if payment_method_input not in PAYMENT_METHODS:
        raise HTTPException(
            status_code=400,
            detail="Invalid payment method.",
        )

    existing_subscription = get_active_subscription(user_id)

    if existing_subscription:
        return {
            "message": "You already have an active HomeVolt Pro membership.",
            "subscription": existing_subscription,
        }

    now = datetime.now(timezone.utc)
    end_date = now + timedelta(days=SUBSCRIPTION_DURATION_DAYS)

    new_subscription = {
        "subscriptionId": f"SUB-{uuid4().hex[:10].upper()}",
        "userId": user_id,
        "plan": SUBSCRIPTION_PLAN,
        "amount": SUBSCRIPTION_PRICE,
        "currency": SUBSCRIPTION_CURRENCY,
        "billingCycle": "monthly",
        "paymentMethod": PAYMENT_METHODS[payment_method_input],
        "paymentStatus": "simulated_success",
        "status": "active",
        "startDate": now.isoformat(),
        "endDate": end_date.isoformat(),
        "autoRenew": False,
        "createdAt": now.isoformat(),
    }

    subscriptions_collection.insert_one(new_subscription)

    return {
        "message": "Demo payment successful!",
        "simulatedPayment": True,
        "subscription": clean_document(new_subscription),
    }


@app.get("/subscriptions/{user_id}")
def get_subscription_status(user_id: str):
    user_id = user_id.strip()

    if not user_id:
        raise HTTPException(
            status_code=400,
            detail="User ID is required.",
        )

    subscription = clean_document(
        subscriptions_collection.find_one(
            {"userId": user_id},
            sort=[("createdAt", -1)],
        )
    )

    if subscription is None:
        return {
            "userId": user_id,
            "isSubscribed": False,
            "status": "inactive",
            "message": "No subscription found for this user.",
        }

    active_subscription = get_active_subscription(user_id)

    if active_subscription:
        return {
            "userId": user_id,
            "isSubscribed": True,
            "status": "active",
            "subscription": active_subscription,
        }

    return {
        "userId": user_id,
        "isSubscribed": False,
        "status": subscription["status"],
        "subscription": subscription,
    }


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


@app.post("/hosts/register", status_code=201)
def register_host(request: HostRegistrationRequest):
    days = [
        "Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday", "Sunday",
    ]

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
            detail="Please select 24/7, Weekdays or Weekends.",
        )

    host_id = next_id("hosts", "HOST")
    charger_id = next_id("chargers", "CH")
    location_id = next_id("locations", "LOC")

    new_host = {
        "hostId": host_id,
        "name": request.fullName.strip(),
        "phone": request.phone.strip(),
        "email": request.email.strip().lower(),
        "address": request.address.strip(),
        "city": request.city.strip(),
        "pincode": request.pincode,
        "verified": False,
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }

    new_charger = {
        "chargerId": charger_id,
        "hostId": host_id,
        "name": request.chargerName.strip(),
        "connectorType": request.connectorType,
        "chargingType": request.chargerType,
        "chargingSpeed": request.chargingSpeed,
        "pricePerHour": request.price,
        "status": "available",
        "description": request.description.strip(),
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }

    new_location = {
        "locationId": location_id,
        "hostId": host_id,
        "address": request.address.strip(),
        "city": request.city.strip(),
        "pincode": request.pincode,
        "latitude": request.latitude,
        "longitude": request.longitude,
    }

    new_schedules = []

    for day in selected_days:
        new_schedules.append(
            {
                "availabilityId": next_id("availability", "AVL"),
                "chargerId": charger_id,
                "day": day,
                "startTime": start_time,
                "endTime": end_time,
                "available": True,
            }
        )

    hosts_collection.insert_one(new_host)
    chargers_collection.insert_one(new_charger)
    locations_collection.insert_one(new_location)
    availability_collection.insert_many(new_schedules)

    return {
        "message": "Host registered successfully!",
        "hostId": host_id,
        "chargerId": charger_id,
        "locationId": location_id,
        "totalChargers": chargers_collection.count_documents({}),
    }