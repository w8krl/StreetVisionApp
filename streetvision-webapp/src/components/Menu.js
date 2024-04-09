import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  FaBars,
  FaTimes,
  FaCog,
  FaSearch,
  FaMapMarkedAlt,
} from "react-icons/fa";

import { BsFillPinMapFill } from "react-icons/bs";
import { PiSirenLight } from "react-icons/pi";
import { SiStitcher } from "react-icons/si";
import { GiCctvCamera } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;
const MenuContainer = styled.div`
  grid-area: menu;
  transition: max-width 0.3s ease-out, min-width 0.3s ease-out;
  background: linear-gradient(
    100deg,
    rgba(49, 139, 195, 1) 0%,
    rgba(93, 201, 205, 1) 35%
  );
  display: flex;
  flex-direction: column;
  gap: 5%;
  overflow: visible;
  z-index: 1;
  max-width: ${({ $collapsed }) => ($collapsed ? "50px" : "200px")};
  min-width: ${({ $collapsed }) => ($collapsed ? "50px" : "200px")};
`;

const UserInfo = styled.div`
  display: ${({ $collapsed }) => ($collapsed ? "none" : "flex")};
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const AvatarContainer = styled.div`
  border-radius: 50%;
  height: 80px;
  width: 80px;
  background-color: white;
`;

const MenuOptions = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  text-transform: uppercase;
  color: white;
`;

const Option = styled.div`
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
  font-size: 0.8rem;
  background-color: rgba(0, 0, 0, 0.1);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) =>
    $collapsed ? "center" : "flex-start"};
  opacity: 0;

  animation: ${fadeIn} 0.5s ease forwards, ${pulse} 1s ease 1;
  animation-delay: ${({ index }) => index * 0.1}s; // Staggered animation delay

  transition: background-color 0.3s ease;
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
    trnasition: background-color 0.3s ease;
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const apiMenuData = [
  { id: 1, label: "Search Cameras", Icon: FaSearch, path: "/search-cameras" },
  { id: 2, label: "Events Dashboard", Icon: PiSirenLight, path: "/events" },
  { id: 3, label: "Surveillance", Icon: GiCctvCamera, path: "/surveillance" },
  { id: 4, label: "Video Decoding", Icon: SiStitcher, path: "/decoding-jobs" },
  // { id: 5, label: "Video Requests", Icon: FaCog, path: "/video-requests" },
  { id: 6, label: "Map View", Icon: FaMapMarkedAlt, path: "/regions" },
  { id: 7, label: "Settings", Icon: FaCog, path: "/settings" },
  { id: 8, label: "Regions", Icon: BsFillPinMapFill, path: "/regions" },
  { id: 9, label: "POI List", Icon: BsFillPinMapFill, path: "/poi/list" },
];

const MenuOptionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  opacity: 1;
`;

const MenuOptionLabel = styled.span`
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  white-space: nowrap;
  overflow: hidden; // Prevent text from overflowing during transition
  transition: opacity 0.6s ease;
  transition-delay: ${({ $collapsed }) =>
    $collapsed ? "0s" : "0.5s"}; // Delay after menu expansion
`;

const Menu = ({ onToggle, collapsed }) => {
  const [menuOptions, setMenuOptions] = useState(apiMenuData);
  const navigate = useNavigate(); // Hook for navigation

  // Function to handle menu option click
  const handleMenuOptionClick = (path) => {
    navigate(path); // Navigate to the clicked menu's path
  };

  return (
    <MenuContainer $collapsed={collapsed}>
      <ToggleButton onClick={onToggle}>
        {collapsed ? <FaBars /> : <FaTimes />}
      </ToggleButton>
      <MenuOptions>
        {menuOptions.map((option, index) => (
          <Option
            key={option.id}
            $collapsed={collapsed}
            index={index}
            onClick={() => handleMenuOptionClick(option.path)} // Add onClick handler
          >
            <MenuOptionIcon>
              <option.Icon />
            </MenuOptionIcon>
            <MenuOptionLabel $collapsed={collapsed}>
              {option.label}
            </MenuOptionLabel>
          </Option>
        ))}
      </MenuOptions>
    </MenuContainer>
  );
};

export default Menu;
