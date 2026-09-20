# HomeVolt EV — API & Data

This folder contains the API, structured JSON data, geocoding, filtering, distance calculation utilities, and tests developed for the HomeVolt EV project.

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
├── .env
├── .gitignore
└── README.md
```
API

The api/ folder contains the API implementation for handling HomeVolt data.

api/main.py

Contains the main API application and API endpoints used to access and process HomeVolt charger, host, location, availability, and booking data.

api/filters.py

Contains filtering functions used to filter charger and location data according to the required parameters.

Data

The data/ folder contains the structured JSON data used by the HomeVolt API.

hosts.json

Contains information about charger owners/hosts.

chargers.json

Contains charger information including:

Charger ID
Host ID
Connector type
Charging speed
Price per hour
locations.json

Contains location information associated with HomeVolt hosts and chargers.

The location data is used for geocoding and distance-based operations.

availability.json

Contains charger availability information.

bookings.json

Contains booking information related to charger usage.

Geocoding

The geocode_locations.py script is used to convert location information into geographical coordinates.

The geocoding process generates:

Latitude
Longitude

These coordinates are used for location-based calculations and charger location data.

Geocoding API

The project uses the HeiGIT / openrouteservice geospatial services for geocoding and location-related operations.

HeiGIT API:

https://api.heigit.org/

An API key is required for accessing the required openrouteservice services.

The API key should be stored locally in the .env file and must not be uploaded to GitHub.

Environment Variable

Create a .env file in the project root and add your API key.

HEIGIT_API_KEY=your_api_key_here

Replace:

your_api_key_here

with your actual HeiGIT/openrouteservice API key.

Do not share or commit the actual API key.

Distance Utilities

The utils/ folder contains distance-related functionality.

utils/distance.py

Contains functions used for calculating distances between geographical coordinates or locations.

utils/charger_distance.py

Contains functions for calculating distances related to HomeVolt chargers.

These utilities can be used to determine the distance between a user's location and available HomeVolt chargers.

Tests

The tests/ folder contains tests for the API and data-related functionality.

The tests cover:

Charger distance calculations
General distance calculations
Environment configuration
Geocoding
Location distance calculations

Run all tests using:

pytest
Setup
1. Clone the Repository

Clone the API & Data branch:

git clone -b "API&Data" https://github.com/Sarthak-vats-cse/HomeVoltEV.git
2. Enter the Project Directory
cd HomeVoltEV
3. Create a Virtual Environment

On Windows:

python -m venv venv

Activate the virtual environment:

venv\Scripts\activate
4. Install Dependencies

Install the required Python packages.

If a requirements.txt file is available:

pip install -r requirements.txt

Otherwise, install the packages required by the API and geocoding scripts according to the project imports.

Environment Configuration

Create a .env file in the project root.

Add:

HEIGIT_API_KEY=your_api_key_here

Replace your_api_key_here with your own API key.

The .env file is excluded from Git using .gitignore so that the API key is not uploaded to GitHub.

Running the API

Activate the virtual environment:

venv\Scripts\activate

Run the FastAPI application:

uvicorn api.main:app --reload

The API will run at:

http://127.0.0.1:8000

FastAPI interactive API documentation is available at:

http://127.0.0.1:8000/docs
Running the Geocoding Script

The geocoding script can be executed from the project root using:

python geocode_locations.py

The script processes the location data and generates geographical coordinates required for location-based operations.

Data Processing Flow
JSON Data
    ↓
API
    ↓
Data Filtering
    ↓
Location Data
    ↓
Geocoding
    ↓
Latitude & Longitude
    ↓
Distance Calculation
    ↓
Charger Location Results
API & Data Components

The API & Data implementation consists of:

Structured JSON datasets
FastAPI application
Data filtering
Location processing
Geocoding
Latitude and longitude generation
Distance calculations
Charger distance calculations
Automated tests
Security

The following files and information must remain private:

.env
API keys
Secret credentials

Never commit an actual API key to GitHub.

The API key should only be stored locally in the .env file.

Development Notes

The JSON files contain development/demo data for HomeVolt.

The venv/ directory should not be uploaded to GitHub.

Each developer should create their own virtual environment and .env file locally.

Technologies Used
Python
FastAPI
JSON
HeiGIT
openrouteservice
OpenStreetMap-based geospatial services
Pytest
