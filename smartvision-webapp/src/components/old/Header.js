import React from "react";
import styled from "styled-components";

const HeaderContainer = styled.header`
  grid-area: header;
  background-color: #f1f1f1;
  padding: 10px;
  text-align: center;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <h1>AFS</h1>
    </HeaderContainer>
  );
};

export default Header;
