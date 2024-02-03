import React from "react";
import styled from "styled-components";
import { Layout, Box } from "../components";

const CamResults = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  margin-top: 20px;
`;

const SearchCams = () => {
  const cameras = [
    { name: "Camera 1", lat: 123.456, long: 789.012, address: "Address 1" },
    { name: "Camera 2", lat: 456.789, long: 12.345, address: "Address 2" },
    { name: "Camera 3", lat: 789.012, long: 345.678, address: "Address 3" },
  ];

  return (
    <Layout>
      <h1>SearchCams</h1>

      <CamResults>
        {cameras.map((camera) => (
          <Box
            key={camera.name}
            title={camera.name}
            content={camera.address}
            footer={`Lat: ${camera.lat}, Long: ${camera.long}`}
          />
        ))}
      </CamResults>
    </Layout>
  );
};

export default SearchCams;
