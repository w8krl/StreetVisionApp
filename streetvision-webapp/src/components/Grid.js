import React from "react";
import styled from "styled-components";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
  grid-template-rows: repeat(${(props) => props.rows}, 1fr);
  gap: 1px;
  background-color: #ccc;
  padding: 10px;
`;

const Cell = styled.div`
  background-color: #fff;
`;

const Grid = ({ columns, rows }) => {
  return (
    <GridContainer columns={columns} rows={rows}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="row">
          {Array.from({ length: columns }).map((_, columnIndex) => (
            <Cell key={columnIndex} className="cell"></Cell>
          ))}
        </div>
      ))}
    </GridContainer>
  );
};

export default Grid;
