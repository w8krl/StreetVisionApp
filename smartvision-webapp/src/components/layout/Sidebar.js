import React from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  grid-area: sidebar;
  background-color: #333;
  color: white;
  padding: 20px;
  position: relative; /* added to position the button */
`;

const ShowHideButton = styled.button`
  position: absolute; /* absolute positioning */
  bottom: 10px;       /* 10px from the bottom */
  left: 50%;          /* horizontally centered */
  transform: translateX(-50%); /* fine-tuning horizontal centering */
  background: none;
  border: none;
  cursor: pointer;
  color: white;
`;

export default function Sidebar({ toggleSidebar }) {
  return (
    <SidebarContainer>
      <h1>Sidebar</h1>
      {/* other sidebar content */}
      <ShowHideButton onClick={toggleSidebar}>
        <i className="fa fa-arrow-left"></i> {/* FontAwesome arrow icon */}
      </ShowHideButton>
    </SidebarContainer>
  );
}
