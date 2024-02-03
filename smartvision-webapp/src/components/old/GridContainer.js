import styled from 'styled-components';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 12% 3fr;
  grid-template-rows: 10% 90%;
  grid-template-areas: 
    "header header"
    "sidebar main-content";
  height: 100vh;
  width: 100vw;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: 15% 85%;
    grid-template-areas:
      "header"
      "main-content";
  }
`;

export default GridContainer;
