import styled from 'styled-components';

export const PageContainer = styled.div`
  text-align: center;
  color: #333;
`;

export const Header = styled.header`
  background-color: #00aaff;
  padding: 20px;
  color: white;
  font-size: 24px;
`;

export const MainContent = styled.main`
  padding: 50px 20px;
`;

export const SearchContainer = styled.div`
  background-color: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: inline-block;
  padding: 20px;
  margin-top: -50px;
`;

export const SearchHeader = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

export const SearchForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
`;

export const InputGroup = styled.div`
  display: flex;
  gap: 10px;
`;

export const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
`;

export const Button = styled.button`
  background-color: #ffcc00;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
`;
