import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Navbar } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
// import { VisaContext } from "../visa/VisaContext";

import { useDispatch, useSelector } from "react-redux";
import { fetchCountries } from "../../redux/features/country/countryThunks";
import { fetchRegions } from "../../redux/features/region/regionThunks";

import {
  setFromCountry,
  setToCountry,
  setPurposeOfTravel,
} from "../../redux/features/country/travelSlice";

import { setRegion } from "../../redux/features/region/setregionSlice";

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

const StyledSelect = styled.select`
  display: block;
`;

const VisaSearch = () => {
  // Redux and local state setup
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCountries());
    dispatch(fetchRegions());
  }, [dispatch]);

  const allCountries = useSelector((state) => state.countries.countries);
  const fromCountry = useSelector((state) => state.travel.fromCountry);
  const toCountry = useSelector((state) => state.travel.toCountry);

  // regions
  const allRegions = useSelector((state) => state.regions.regions);
  const region = useSelector((state) => state.region.selectedRegion);

  const navigate = useNavigate();
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate("/suggested-results");
  };

  const handleFromCountryChange = (e) => {
    const selectedCountry = e.target.value;
    dispatch(setFromCountry(selectedCountry));
    if (selectedCountry === toCountry) {
      dispatch(setToCountry(""));
    }
  };

  const handleToCountryChange = (e) => {
    dispatch(setToCountry(e.target.value));
  };

  const handlePurposeChange = (e) => {
    dispatch(setPurposeOfTravel(e.target.value));
  };

  const handleRegionChange = (e) => {
    const selectedRegion = e.target.value;
    dispatch(setRegion(selectedRegion));
    const newUrl = window.location.origin + "/" + selectedRegion;
    window.location.href = newUrl;
  };

  const fromCountriesOptions = allCountries;
  const toCountriesOptions = allCountries.filter(
    (country) => country.code !== fromCountry
  );

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
          <BannerTitle>Advanced Foreign Services - region UK</BannerTitle>
        </StyledBanner>

        <SearchForm>
          <VisaSearchTitle>Visa Search</VisaSearchTitle>
          <VisaSearchDescription>
            Find the perfect visa today!
          </VisaSearchDescription>

          <form onSubmit={handleSearchSubmit}>
            <Container>
              <Row>
                <Col className="col-lg-6">
                  <label className="d-block" htmlFor="travelling-to">
                    Confirm you you are applying from:
                  </label>
                  <Select
                    className="form-control"
                    value={region}
                    onChange={handleRegionChange}
                  >
                    <option value="">Select a country</option>
                    {allRegions.map((region) => (
                      <option
                        key={region.serviceName}
                        value={region.serviceName}
                      >
                        {region.regionName}
                      </option>
                    ))}
                  </Select>
                </Col>
              </Row>
              <Row className="pt-5">
                <Col>
                  {/* Travelling from select */}
                  <label className="d-block" htmlFor="travelling-from">
                    Please select your nationality:
                  </label>
                  <Select
                    className="form-control"
                    value={fromCountry}
                    onChange={handleFromCountryChange}
                  >
                    <option value="">Select a country</option>
                    {fromCountriesOptions.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </Select>
                </Col>
                <Col>
                  {/* Travelling to select */}
                  <label className="d-block" htmlFor="travelling-to">
                    Travelling to:
                  </label>
                  <Select
                    className="form-control"
                    value={toCountry}
                    onChange={handleToCountryChange}
                  >
                    <option value="">Select a country</option>
                    {toCountriesOptions.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </Select>
                </Col>
              </Row>

              <Row>
                <Col className="col-lg-6">
                  <p className="mt-3">Select purpose of travel:</p>

                  <select
                    className="form-control"
                    onChange={handlePurposeChange}
                  >
                    <option value="tourism">Tourism</option>
                    <option value="business">Business</option>
                    <option value="study">Study</option>
                    <option value="other">Other</option>
                  </select>

                  <div className="pt-2 pb">
                    <SearchButton
                      className="btn-search"
                      type="submit"
                      value="Let's go!"
                    />
                  </div>
                </Col>
              </Row>
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

export default VisaSearch;
