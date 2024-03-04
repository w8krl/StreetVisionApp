import React, { useState, useEffect } from "react";
import styled from "styled-components";

const BreadcrumbContainer = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px;
  backgroundcolor: white;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  color: #2196f3;
  letter-spacing: 1px;
`;

const A = styled.a`
  text-decoration: none;
  transition: 0.5s;
  color: #2196f3;
  &:hover {
    text-decoration: underline;
    transition: 0.5s;
  }
`;

const items = [
  { label: "Home", link: "/" },
  { label: "Cameras", link: "/cameras" },
  { label: "Search", link: "/cameras/search" },
];
const Breadcrumb = () => {
  const [navItems, setNavItems] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setNavItems(items);
    }, 500);
  }, []);

  return (
    <BreadcrumbContainer>
      {navItems.map((option, index) => (
        <A key={index} href={option.link}>
          {option.label} {index !== navItems.length - 1 && "|"}
        </A>
      ))}
    </BreadcrumbContainer>
  );
};

export default Breadcrumb;
