import React, { useState } from "react";
import styled from "styled-components";
import Header from "./Header";
import Menu from "./Menu";
import Breadcrumb from "./Breadcrumb";

const GridContainer = styled.div`
  display: grid;
  grid-template-areas: "header header" "menu main";
  grid-template-rows: auto 1fr;
  grid-template-columns: ${({ $menuCollapsed }) =>
      $menuCollapsed ? "50px" : "200px"} 1fr;
  transition: grid-template-columns 0.3s ease;
  height: 100vh;
  paddin: ;
`;

const MainContentContainer = styled.main`
  grid-area: main;
  background-color: #f9f9f9;
`;

const MainContent = styled.div`
  background-color: white;
  padding: 1rem;
  border-radius: 3px;
  margin: 1rem;
`;

const Layout = ({ children }) => {
  const [menuCollapsed, setMenuCollapsed] = useState(false);

  const toggleMenu = () => {
    setMenuCollapsed(!menuCollapsed);
  };

  return (
    <GridContainer $menuCollapsed={menuCollapsed}>
      <Header />
      <Menu onToggle={toggleMenu} collapsed={menuCollapsed} />
      <MainContentContainer>
        <Breadcrumb />
        <MainContent>{children}</MainContent>
      </MainContentContainer>
    </GridContainer>
  );
};

export default Layout;
