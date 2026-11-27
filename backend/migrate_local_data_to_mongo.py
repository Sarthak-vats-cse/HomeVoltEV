import json
import re
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

from api.auth import database


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

collections = {
    "hosts": (database["hosts"], "hosts.json", "hostId"),
    "chargers": (database["chargers"], "chargers.json", "chargerId"),
    "locations": (database["locations"], "locations.json", "locationId"),
    "availability": (
        database["availability"],
        "availability.json",
        "availabilityId",
    ),
    "bookings": (database["bookings"], "bookings.json", "bookingId"),
    "subscriptions": (
        database["subscriptions"],
        "subscriptions.json",
        "subscriptionId",
    ),
}

counters = database["counters"]


def load_json(filename):
    path = DATA_DIR / filename

    if not path.exists():
        return []

    with open(path, "r", encoding="utf-8") as file:
        return json.load(file)


def highest_number(records, field_name, prefix):
    values = []

    for record in records:
        value = str(record.get(field_name, ""))
        match = re.fullmatch(rf"{prefix}(\d+)", value)

        if match:
            values.append(int(match.group(1)))

    return max(values, default=0)


def migrate_json_data():
    counter_rules = {
        "hosts": ("hostId", "HOST"),
        "chargers": ("chargerId", "CH"),
        "locations": ("locationId", "LOC"),
        "availability": ("availabilityId", "AVL"),
        "bookings": ("bookingId", "BOOK"),
    }

    for name, (collection, filename, id_field) in collections.items():
        records = load_json(filename)

        for record in records:
            collection.update_one(
                {id_field: record[id_field]},
                {"$setOnInsert": record},
                upsert=True,
            )

        print(f"{name}: migrated {len(records)} records")

        if name in counter_rules:
            field_name, prefix = counter_rules[name]
            highest = highest_number(records, field_name, prefix)

            counters.update_one(
                {"_id": name},
                {"$max": {"sequence": highest}},
                upsert=True,
            )


def as_datetime(value):
    if not value:
        return None

    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))

        if parsed.tzinfo is None:
            return parsed.replace(tzinfo=timezone.utc)

        return parsed
    except ValueError:
        return None


def migrate_sqlite_users():
    sqlite_path = DATA_DIR / "users.db"

    if not sqlite_path.exists():
        print("users.db not found; skipping SQLite user migration.")
        return

    users_collection = database["users"]
    sessions_collection = database["auth_sessions"]

    connection = sqlite3.connect(sqlite_path)
    connection.row_factory = sqlite3.Row

    user_map = {}

    for old_user in connection.execute("SELECT * FROM users"):
        email = old_user["email"].strip().lower()

        user = users_collection.find_one({"email": email})

        if user is None:
            result = users_collection.insert_one(
                {
                    "full_name": old_user["full_name"],
                    "email": email,
                    "password_hash": old_user["password_hash"],
                    "created_at": old_user["created_at"],
                }
            )
            user_id = result.inserted_id
        else:
            user_id = user["_id"]

        user_map[old_user["id"]] = user_id

    for old_session in connection.execute("SELECT * FROM auth_sessions"):
        mongo_user_id = user_map.get(old_session["user_id"])
        expires_at = as_datetime(old_session["expires_at"])

        if mongo_user_id and expires_at:
            sessions_collection.update_one(
                {"token_hash": old_session["token_hash"]},
                {
                    "$setOnInsert": {
                        "user_id": mongo_user_id,
                        "token_hash": old_session["token_hash"],
                        "expires_at": expires_at,
                    }
                },
                upsert=True,
            )

    connection.close()
    print("SQLite users and sessions migrated.")


migrate_json_data()
migrate_sqlite_users()

print("Migration completed successfully.")