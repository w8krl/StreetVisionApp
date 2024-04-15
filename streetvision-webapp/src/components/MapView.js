import L from "leaflet";
import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { FullscreenControl } from "react-leaflet-fullscreen";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let defaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;
// Internal component to handle map click and set marker
const ClickLocationMarker = ({ onMapClick }) => {
  const [position, setPosition] = useState(null);
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      if (onMapClick) {
        onMapClick(e.latlng);
      }
    },
  });

  // Render a default marker if a position has been set
  return position ? (
    <Marker position={position}>
      <Popup>Selected Location</Popup>
    </Marker>
  ) : null;
};

const MapView = ({ markers, mapCenter, zoom, onMapClick }) => {
  return (
    <MapContainer
      center={[mapCenter.lat, mapCenter.lng]}
      zoom={zoom}
      style={{ height: "50vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup>
        {markers.map(({ key, position, icon, popup }) => (
          <Marker key={key} position={position} icon={icon}>
            <Popup>{popup}</Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
      <FullscreenControl />
      <ClickLocationMarker onMapClick={onMapClick} />{" "}
    </MapContainer>
  );
};

export default MapView;
