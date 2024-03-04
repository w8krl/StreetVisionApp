import React, { useContext } from "react";
import styled from "styled-components";
import { Navbar } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { VisaContext } from "../visa/VisaContext";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const StyledBanner = styled.div`
  padding: 3rem;
  background-color: #a7e3ff;
  height: 20rem;
  overflow: hidden;
  background-image: url("/banner-bg.svg"); // Adjust the path as necessary
  background-size: conta; // Use 'cover' to ensure the image covers the entire container
  background-position: right; // Center the image within the container
  z-index: -1;
  background-repeat: no-repeat;
`;

const StyledUL = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;
const BannerTitle = styled.h1`
  color: white;
`;

const SearchForm = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 60%;
  z-index: 100;
  padding: 4em;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const VisaSearchTitle = styled.h3`
  font-family: "Roboto", sans-serif;
`;

const VisaSearchDescription = styled.p`
  font-weight: lighter;
`;

const Select = styled.select`
  width: 100%;
  padding: 4px 4px;
  border: none;
  border-radius: 4px;
  background-color: #f1f1f1;
`;

const TravelOptions = styled.div`
  label {
    display: inline-block;
    padding: 0.5em 1em;
    border-radius: 4px;
    cursor: pointer;
  }

  input[type="radio"]:checked + label {
    color: white;
  }
`;

const SearchButton = styled.input`
  background-color: #f2cb05;
  border: none;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
`;

const StyledLink = styled.a`
  text-decoration: none;
  color: inherit; // Optional: to inherit text color from parent

  &:hover {
    text-decoration: none;
    color: inherit; // Optional: define hover color
  }
`;

const TestPage = () => {
  const navigate = useNavigate();
  const { fetchVisaSuggestions } = useContext(VisaContext);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchVisaSuggestions();
    navigate("/suggested-results");
  };
  return (
    <>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">
            <b>AFS</b>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              Signed in as: <a href="#login">Karl Webster</a>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Wrapper>
        <StyledBanner>
          <BannerTitle>Advanced Foreign Services</BannerTitle>
        </StyledBanner>

        <SearchForm>
          <VisaSearchTitle>Visa Search</VisaSearchTitle>
          <VisaSearchDescription>
            Find the perfect visa today!
          </VisaSearchDescription>

          <form onSubmit={handleSearchSubmit}>
            <Container>
              <Row>
                <Col>
                  <label htmlFor="travelling-from">Travelling from:</label>
                  <Select name="orig" id="orig" className="select-dest">
                    <option value="" disabled selected>
                      Select a country
                    </option>
                    <option value="USA">United States</option>
                    <option value="CAN">Canada</option>
                    <option value="AUS">Australia</option>
                    <option value="GER">Germany</option>
                  </Select>
                </Col>
                <Col>
                  <label htmlFor="travelling-to">Travelling to:</label>
                  <Select name="dest" id="dest" className="select-dest">
                    <option value="" disabled selected>
                      Select a country
                    </option>
                    <option value="USA">United States</option>
                    <option value="CAN">Canada</option>
                    <option value="AUS">Australia</option>
                    <option value="GER">Germany</option>
                  </Select>
                </Col>
              </Row>

              <p className="mt-3">Select purpose of travel:</p>

              <TravelOptions>
                <input
                  type="radio"
                  id="purpose-tourism"
                  name="purpose"
                  value="tourism"
                />
                <label htmlFor="purpose-tourism">Tourism</label>
                <input
                  type="radio"
                  id="purpose-business"
                  name="purpose"
                  value="business"
                />
                <label htmlFor="purpose-business">Business</label>
              </TravelOptions>

              <div className="pt-2 pb">
                <SearchButton
                  className="btn-search"
                  type="submit"
                  value="Let's go!"
                />
              </div>
            </Container>
          </form>
        </SearchForm>
        <footer
          className="footer mt-auto py-3 fixed-bottom"
          style={{ backgroundColor: "#f2cb05" }}
        >
          <Container>
            <Row>
              <Col>
                <h3>Connect</h3>
                <StyledUL>
                  <li>
                    <StyledLink href="#">Facebook</StyledLink>
                  </li>
                  <li>
                    <StyledLink href="#">Twitter</StyledLink>
                  </li>
                  <li>
                    <StyledLink href="#">Instagram</StyledLink>
                  </li>
                </StyledUL>
              </Col>
              <Col>
                <h3>Quick Links</h3>
                <StyledUL>
                  <li>
                    <StyledLink href="#">Home</StyledLink>
                  </li>
                  <li>
                    <StyledLink href="#">Visa Search</StyledLink>
                  </li>
                  <li>
                    <StyledLink href="#">About Us</StyledLink>
                  </li>
                  <li>
                    <StyledLink href="#">Contact Us</StyledLink>
                  </li>
                </StyledUL>
              </Col>
              <Col>
                <h3>Company</h3>
                <StyledUL>
                  <li>
                    <StyledLink href="#">About Us</StyledLink>
                  </li>
                  <li>
                    <StyledLink href="#">Careers</StyledLink>
                  </li>
                  <li>
                    <StyledLink href="#">Terms of Service</StyledLink>
                  </li>
                  <li>
                    <StyledLink href="#">Privacy Policy</StyledLink>
                  </li>
                </StyledUL>
              </Col>
            </Row>
          </Container>
        </footer>
      </Wrapper>
    </>
  );
};

export default TestPage;
