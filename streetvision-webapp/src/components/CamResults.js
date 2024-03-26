import React from "react";
import styled from "styled-components";

// Styled
const StyledCamResults = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(240px, 1fr)
  ); /* Creates a responsive grid */
  gap: 16px; /* Space between items */
  padding: 20px; /* Padding around the grid */
`;

const CamResults = ({ children }) => {
  return <StyledCamResults>{children}</StyledCamResults>;
};

export default CamResults;
