import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const HeaderContainer = styled.div`
  grid-area: header;
  background-color: #000;
  color: white;
  display: flex;
  padding: 10px;
  top: 0;
  position: sticky;
  z-index: 10;
`;

const Title = styled.div`
  font-family: Arial, Helvetica, sans-serif; // Adjusted font-family
  font-size: 2.2rem;
  font-weight: bold;
  cursor: pointer; // Makes it clear it's clickable
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit; // Inherits the white color from the parent
`;

const Header = () => {
  return (
    <HeaderContainer>
      <StyledLink to="/">
        <Title>StreetVision</Title>
      </StyledLink>
    </HeaderContainer>
  );
};

export default Header;
