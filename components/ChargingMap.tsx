"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

type ChargingMapProps = {
  visibleChargerIds: string[] | null;
  destination: {
    latitude: number;
    longitude: number;
  } | null;
};

export default function ChargingMap({
  visibleChargerIds,
  destination,
}: ChargingMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);

const chargerMarkersRef = useRef<
  Map<string, import("leaflet").Marker>
>(new Map());

const drawRouteRef = useRef<
  ((lat: number, lng: number) => Promise<void>) | null
>(null);

const clearRouteRef = useRef<(() => void) | null>(null);

const visibleIdsRef = useRef<string[] | null>(
  visibleChargerIds
);

  useEffect(() => {
    if (!mapRef.current) return;
    if (leafletMapRef.current) return;

    const loadMap = async () => {
      const L = await import("leaflet");

      if (!mapRef.current) return;
      if (leafletMapRef.current) return;

      const map = L.map(mapRef.current).setView(
  [28.70, 77.20],
9.1
);
let userLocation: [number, number] | null = null;

let routeLine: import("leaflet").Polyline | null = null;

let routeRequestId = 0;

const drawRoute = async (
  chargerLat: number,
  chargerLng: number
) => {
  if (!userLocation) {
    alert("Please click the location button first.");
    return;
  }

  const requestId = ++routeRequestId;
  const [userLat, userLng] = userLocation;

  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${chargerLng},${chargerLat}?overview=full&geometries=geojson`
    );

    if (!response.ok) {
      throw new Error("Routing request failed");
    }

    const data = await response.json();

    if (requestId !== routeRequestId) return;

    if (data.code !== "Ok" || !data.routes?.length) {
      alert("No driving route found.");
      return;
    }

    const route = data.routes[0];

    const routeCoordinates =
      route.geometry.coordinates.map(
        (coord: [number, number]) =>
          [coord[1], coord[0]] as [number, number]
      );

    if (routeLine) {
      map.removeLayer(routeLine);
    }

    routeLine = L.polyline(routeCoordinates, {
      color: "#2563eb",
      weight: 5,
      opacity: 0.9,
      lineJoin: "round",
      lineCap: "round",
    }).addTo(map);

    const distance = (route.distance / 1000).toFixed(1);
    const duration = Math.round(route.duration / 60);

    routeLine.bindTooltip(
      `Driving distance: ${distance} km | ${duration} mins`,
      {
        sticky: true,
      }
    );

    map.closePopup();

    map.fitBounds(routeLine.getBounds(), {
      padding: [40, 40],
      maxZoom: 14,
    });

    L.popup()
      .setLatLng([chargerLat, chargerLng])
      .setContent(`
        <strong>Driving Route</strong><br/>
        Distance: ${distance} km<br/>
        Estimated time: ${duration} mins
      `)
      .openOn(map);

  } catch (error) {
    console.error("Routing error:", error);
    alert("Unable to calculate route. Please try again.");
  }
};
drawRouteRef.current = drawRoute;

clearRouteRef.current = () => {
  routeRequestId++;

  if (routeLine) {
    map.removeLayer(routeLine);
    routeLine = null;
  }

  map.closePopup();
};
const LocationControl = L.Control.extend({
  options: {
    position: "topleft",
  },

  onAdd: () => {
  const button = L.DomUtil.create(
    "button",
    "homevolt-location-button"
  );
  button.style.cursor = "pointer";
  button.innerHTML = "📍";
  button.title = "Show my location";

  L.DomEvent.disableClickPropagation(button);

  L.DomEvent.on(button, "click", () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        userLocation = [latitude, longitude];

        console.log("User location:", latitude, longitude);
        console.log("Accuracy:", position.coords.accuracy, "meters");

      map.setView([latitude, longitude], 4.2);
        L.circleMarker([latitude, longitude], {
  radius: 9,
  fillColor: "#2563eb",
  color: "#ffffff",
  weight: 3,
  opacity: 1,
  fillOpacity: 1,
  pane: "markerPane",
}).addTo(map);
          
      },
      (error) => {
        console.error("Location error:", error);

        if (error.code === 1) {
          alert("Location permission was denied.");
        } else if (error.code === 2) {
          alert("Your location could not be determined.");
        } else if (error.code === 3) {
          alert("Location request timed out.");
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );
  });

  return button;
  },
});

new LocationControl().addTo(map);
map.setMinZoom(9.1);

      leafletMapRef.current = map;

      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      ).addTo(map);

      fetch("http://127.0.0.1:8000/chargers")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch chargers");
          }

          return response.json();
        })
        .then((data) => {
          console.log("HomeVolt charger data:", data);

          

          data.chargers.forEach((item: any) => {
            const charger = item.charger;
            const location = item.location;

            if (
              location?.latitude == null ||
              location?.longitude == null
            ) {
              return;
            }

           const chargerIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 32px;
      height: 32px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(0,0,0,0.25);
      border: 3px solid #16a34a;
      position: relative;
    ">
      <div style="
        width: 22px;
        height: 22px;
        background: #16a34a;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 13px;
        font-weight: bold;
      ">
        ⚡
      </div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -18],
});


const marker = L.marker(
  [location.latitude, location.longitude],
  {
    icon: chargerIcon,
  }
);



            
const popupContent = document.createElement("div");

popupContent.innerHTML = `
  <strong>${charger.name}</strong><br/>
  Charger ID: ${charger.chargerId}<br/>
  Connector: ${charger.connectorType}<br/>
  Charging: ${charger.chargingSpeed} kW<br/>
  Price: ₹${charger.pricePerHour}/hour<br/>
  Status: ${charger.status}
`;

const directionsButton = document.createElement("button");

directionsButton.innerText = "Get Directions";

directionsButton.style.cssText = `
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 9px 14px;
  margin-top: 12px;
  width: 100%;
  font-weight: 600;
  cursor: pointer;
`;

L.DomEvent.disableClickPropagation(directionsButton);

directionsButton.onclick = () => {
  drawRoute(
    location.latitude,
    location.longitude
  );
};

popupContent.appendChild(directionsButton);

marker.bindPopup(popupContent);


            
const chargerId = String(charger.chargerId);

chargerMarkersRef.current.set(chargerId, marker);

if (
  visibleIdsRef.current === null ||
  visibleIdsRef.current.includes(chargerId)
) {
  marker.addTo(map);
}

          });
        })
        .catch((error) => {
          console.error("HomeVolt API error:", error);
        });
    };

    loadMap();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

useEffect(() => {
  visibleIdsRef.current = visibleChargerIds;

  const map = leafletMapRef.current;

  if (!map) return;

  clearRouteRef.current?.();

  chargerMarkersRef.current.forEach((marker, id) => {
    const shouldShow =
      visibleChargerIds === null ||
      visibleChargerIds.includes(id);

    if (shouldShow) {
      if (!map.hasLayer(marker)) {
        marker.addTo(map);
      }
    } else {
      if (map.hasLayer(marker)) {
        map.removeLayer(marker);
      }
    }
  });
}, [visibleChargerIds]);

useEffect(() => {
  if (!destination) {
    clearRouteRef.current?.();
    return;
  }

  drawRouteRef.current?.(
    destination.latitude,
    destination.longitude
  );
}, [destination]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}