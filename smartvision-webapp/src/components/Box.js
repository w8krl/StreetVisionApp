import React from "react";
import styled from "styled-components";

const BoxContainer = styled.div`
  border-radius: 3px;
  margin-bottom: 10px;
  border: solid 1px #e0e0e0;
`;

const BoxTitle = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
  border-bottom: solid 1px #e0e0e0;
  padding: 3px;
`;

const BoxContent = styled.div`
  margin-bottom: 10px;
  height: 100px;
  padding: 3px;
`;

const BoxFooter = styled.div`
  display: flex;
  align-items: center;
  border-top: solid 1px #e0e0e0;
  padding: 3px;
`;

const Box = ({ title, content, footer }) => {
  return (
    <BoxContainer>
      <BoxTitle>{title}</BoxTitle>
      <BoxContent>{content}</BoxContent>
      <BoxFooter>{footer}</BoxFooter>
    </BoxContainer>
  );
};

export default Box;
