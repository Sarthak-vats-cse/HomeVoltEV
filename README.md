# HomeVolt EV — API & Data

This repository contains the API and data layer developed for the HomeVolt EV project.

It includes structured JSON datasets, FastAPI endpoints, data filtering, geocoding, distance calculations, charger-distance utilities, and automated tests.

## Project Structure

```text
HomeVolt-API-Data/
│
├── api/
│   ├── main.py
│   └── filters.py
│
├── data/
│   ├── availability.json
│   ├── bookings.json
│   ├── chargers.json
│   ├── hosts.json
│   └── locations.json
│
├── tests/
│   ├── test_charger_distance.py
│   ├── test_distance.py
│   ├── test_env.py
│   ├── test_geocoding.py
│   └── test_location_distances.py
│
├── utils/
│   ├── charger_distance.py
│   └── distance.py
│
├── geocode_locations.py
├── .gitignore
└── README.md
```

## API

### `api/main.py`

Contains the main FastAPI application and endpoints for accessing and processing HomeVolt charger, host, location, availability, and booking data.

### `api/filters.py`

Contains filtering functionality for retrieving relevant charger and location data based on the required parameters.

## Data

The `data/` directory contains the structured JSON datasets used by the API and location-processing utilities.

### `hosts.json`

Stores information about HomeVolt charger hosts.

### `chargers.json`

Stores charger information such as:

- Charger ID
- Host ID
- Connector type
- Charging speed
- Price per hour

### `locations.json`

Stores location information associated with HomeVolt hosts and chargers.

### `availability.json`

Stores charger availability information.

### `bookings.json`

Stores booking-related information.

## Geocoding

The `geocode_locations.py` script processes location information and converts addresses or location data into geographical coordinates.

The generated coordinates include:

- Latitude
- Longitude

These coordinates are used for location-based operations and distance calculations.

## Geocoding API

The project uses HeiGIT / openrouteservice services for geospatial operations.

API service:

https://api.heigit.org/

An API key is required for the geospatial services used by the project.

Create an API key through the HeiGIT/openrouteservice service and store it locally in the `.env` file.

### Environment Variable

```env
HEIGIT_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual API key.

**Never upload the actual API key to GitHub.**

The `.env` file is excluded through `.gitignore`.

## Distance Utilities

### `utils/distance.py`

Contains functions for calculating distances between geographical coordinates or locations.

### `utils/charger_distance.py`

Contains functions for calculating distances between users/locations and HomeVolt chargers.

These utilities are used for location-based charger discovery and distance calculations.

## Tests

The `tests/` directory contains tests for the API and data functionality.

Tests include:

- Charger distance calculations
- General distance calculations
- Environment configuration
- Geocoding
- Location distance calculations

Run the tests using:

```bash
pytest
```

## Setup

### Clone the API & Data Branch

```bash
git clone -b "API&Data" https://github.com/Sarthak-vats-cse/HomeVoltEV.git
```

### Enter the Repository

```bash
cd HomeVoltEV
```

### Create a Virtual Environment

Windows:

```powershell
python -m venv venv
```

Activate it:

```powershell
venv\Scripts\activate
```

### Install Dependencies

If a `requirements.txt` file is available:

```powershell
pip install -r requirements.txt
```

Otherwise, install the required packages used by the API and data-processing scripts.

## Environment Configuration

Create a `.env` file in the project root:

```env
HEIGIT_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your own API key.

Do not commit `.env` or expose the API key publicly.

## Running the API

Activate the virtual environment:

```powershell
venv\Scripts\activate
```

Start the FastAPI application:

```powershell
uvicorn api.main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

## Running Geocoding

Run the geocoding script from the project root:

```powershell
python geocode_locations.py
```

The script processes the location data and generates geographical coordinates.

## Data Processing Flow

```text
JSON Data
    ↓
FastAPI
    ↓
Data Filtering
    ↓
Location Processing
    ↓
Geocoding
    ↓
Latitude & Longitude
    ↓
Distance Calculation
    ↓
Charger Distance Results
```

## API & Data Components

The API & Data implementation includes:

- Structured JSON datasets
- FastAPI application
- Data filtering
- Host and charger data
- Location data
- Availability data
- Booking data
- Geocoding
- Latitude and longitude processing
- Distance calculations
- Charger distance calculations
- Automated testing

## Security

The following must remain private:

- `.env`
- API keys
- Secret credentials

Never commit an actual API key to GitHub.

The API key should only be stored locally in the `.env` file.

## Development Notes

- The JSON files contain development/demo data.
- `.env` should remain local.
- `venv/` should not be uploaded to GitHub.
- Each developer should create their own virtual environment.
- Each developer should use their own API key in their local `.env` file.

## Technologies Used

- Python
- FastAPI
- JSON
- HeiGIT
- openrouteservice
- OpenStreetMap-based geospatial services
- Pytest
