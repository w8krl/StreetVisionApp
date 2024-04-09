import React, { useEffect, useState } from "react";

const DataTable = () => {
  const [cameras, setCameras] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Mock fetch function to simulate fetching data from an API
    const fetchCameras = async () => {
      const mockCamerasData = [
        { name: "Camera 1", lat: 123.456, lon: 789.012, address: "Address 1" },
        { name: "Camera 2", lat: 456.789, lon: 12.345, address: "Address 2" },
        { name: "Camera 3", lat: 789.012, lon: 345.678, address: "Address 3" },
        // Add more mock data as needed
      ];
      setCameras(mockCamerasData);
    };

    fetchCameras();
  }, []);

  // Filter cameras based on search term
  const filteredCameras = cameras.filter(
    (camera) =>
      camera.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camera.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search cameras..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {filteredCameras.map((camera, index) => (
            <tr key={index}>
              <td>{camera.name}</td>
              <td>{camera.lat}</td>
              <td>{camera.lon}</td>
              <td>{camera.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
