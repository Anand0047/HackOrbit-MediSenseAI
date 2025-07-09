// components/MapPopup.jsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const MapPopup = ({ specialist, onClose }) => {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setPosition([pos.coords.latitude, pos.coords.longitude]);
    });
  }, []);

  return (
<div className="bg-white rounded-lg shadow-lg p-4 max-w-3xl w-full relative pointer-events-auto">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-3xl w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-600"
          onClick={onClose}
        >
          ❌
        </button>

        <h2 className="text-xl font-bold mb-4">
          Nearby: {specialist} (detected location)
        </h2>

        {position ? (
          <>
            <MapContainer center={position} zoom={13} style={{ height: "400px" }}>
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position} icon={L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', iconSize: [25, 41], iconAnchor: [12, 41] })}>
                <Popup>
                  You are here. Searching: <strong>{specialist}</strong>
                </Popup>
              </Marker>
            </MapContainer>
            <div className="mt-4 text-center">
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(specialist)}+near+${position[0]},${position[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Open in Google Maps
              </a>
            </div>
          </>
        ) : (
          <p>Getting your location...</p>
        )}
      </div>
    </div>
  );
};

export default MapPopup;
