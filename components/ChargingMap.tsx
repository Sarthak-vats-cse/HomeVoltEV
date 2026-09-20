"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export default function ChargingMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);

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



            marker.bindPopup(`
              <strong>${charger.name}</strong><br/>
              Charger ID: ${charger.chargerId}<br/>
              Connector: ${charger.connectorType}<br/>
              Charging: ${charger.chargingSpeed} kW<br/>
              Price: ₹${charger.pricePerHour}/hour<br/>
              Status: ${charger.status}
            `);

            marker.addTo(map);
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