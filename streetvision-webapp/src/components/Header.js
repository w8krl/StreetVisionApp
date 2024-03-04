import React from "react";
import styled from "styled-components";

const HeaderContainer = styled.div`
  grid-area: header;
  background-color: #000;
  color: white;
  display: flex;
  padding: 10px;
`;

const Title = styled.div`
  font-family: poppins;
  font-size: 2.2rem;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Title>StreetVision</Title>
      {/* Other header contents */}
    </HeaderContainer>
  );
};

export default Header;
