import React from 'react';
import styled from 'styled-components';

const MainContentContainer = styled.main`
  grid-area: main-content;
  background-color: #f9f9f9;
  padding: 20px;
`;

const MainContent = () => {
  return (
    <MainContentContainer>
      <p>Welcome to the main content area!</p>
    </MainContentContainer>
  );
};

export default MainContent;
