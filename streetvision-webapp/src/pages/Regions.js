import React, { useState, useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";
import { GiCctvCamera } from "react-icons/gi";
import MapView from "../components/MapView";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button } from "react-bootstrap";
import Layout from "../components/Layout";
import { GrView } from "react-icons/gr";

const Regions = () => {
  const [cameras, setCameras] = useState([]);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 53.3745, lng: -1.4626 });
  const [zoom, setZoom] = useState(6);

  // item selecte
  const [primaryCameraId, setPrimaryCameraId] = useState(null);

  useEffect(() => {
    // Fetch all cameras initially
    fetchCamerasNear(mapCenter.lat, mapCenter.lng, 10000);
  }, []);

  const fetchCamerasNear = async (lat, lng, radius) => {
    const url = `http://localhost:9000/api/camerasNear?longitude=${lng}&latitude=${lat}&radius=${radius}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setCameras(data);
      console.log("Camera data fetched:", data);
    } catch (error) {
      console.error("Error fetching camera data:", error);
    }
  };

  // Filter cameras based on active status if showActiveOnly is true
  const filteredCameras = showActiveOnly
    ? cameras.filter((cam) => cam.is_active)
    : cameras;

  const createCustomIcon = (isActive) => {
    const svgMarkup = renderToStaticMarkup(
      <GiCctvCamera size={24} color={isActive ? "green" : "red"} />
    );
    const iconUrl = `data:image/svg+xml;base64,${btoa(svgMarkup)}`;
    return new L.Icon({
      iconUrl,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [1, -24],
    });
  };

  const setPrimary = (camId) => {
    console.log("Set Primary", camId);
    setPrimaryCameraId(camId);
  };

  // Convert camera data to marker props expected by MapView
  const markers = filteredCameras.map((camera) => ({
    key: camera._id,
    position: [camera.geometry.coordinates[1], camera.geometry.coordinates[0]],
    icon: createCustomIcon(camera.is_active),
    popup: (
      <div>
        <h3>{camera.cam_name}</h3>

        <p>
          <b>Active:</b> {camera.is_active ? "Yes" : "No"}
        </p>
        <p>
          <b>Active Date:</b> {camera.active_date}
        </p>
        <p>
          <b>Location:</b> {camera.location}
        </p>
        <Button size="sm" onClick={() => setPrimary(camera._id)}>
          <GrView /> View Camera
        </Button>
      </div>
    ),
  }));

  return (
    <Layout>
      <h2>Camera Map</h2>
      <Form.Check
        type="checkbox"
        label="Show Active Cameras Only"
        checked={showActiveOnly}
        onChange={(e) => setShowActiveOnly(e.target.checked)}
      />
      <MapView markers={markers} mapCenter={mapCenter} zoom={zoom} />
    </Layout>
  );
};

export default Regions;
