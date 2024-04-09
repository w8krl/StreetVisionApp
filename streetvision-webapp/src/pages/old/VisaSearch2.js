import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { VisaContext } from "../../visa/VisaContext";
import {
  PageContainer,
  Header,
  MainContent,
  SearchContainer,
  SearchHeader,
  SearchForm,
  InputGroup,
  Input,
  Button,
} from "../../styled/VisaSearchStyles";

const VisaSearch = () => {
  const navigate = useNavigate();
  const { setVisaSuggestions } = useContext(VisaContext);

  const [nationality, setNationality] = useState("");
  const [destination, setDestination] = useState("");
  const [purposeOfTravel, setPurposeOfTravel] = useState("");

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://visa-auth-service:9000/visa-search",
        {
          sourceCountry: nationality,
          destinationCountry: destination,
          purposeOfTravel: purposeOfTravel,
        }
      );
      setVisaSuggestions(response.data);
      navigate("/suggested-results");
    } catch (error) {
      console.error("Error fetching visa suggestions:", error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <PageContainer>
      <Header>Welcome to AFS</Header>
      <MainContent>
        <SearchContainer>
          <SearchHeader>
            Find the visa that's right for you and apply today!
          </SearchHeader>
          <SearchForm onSubmit={handleSearchSubmit}>
            <InputGroup>
              <Input
                placeholder="My nationality is.."
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
              />
              <Input
                placeholder="I'm traveling to.."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </InputGroup>
            <InputGroup>
              <Input
                type="radio"
                name="travelPurpose"
                id="tourism"
                value="Tourism"
                onChange={() => setPurposeOfTravel("Tourism")}
              />
              <label htmlFor="tourism">Tourism</label>
              <Input
                type="radio"
                name="travelPurpose"
                id="business"
                value="Business"
                onChange={() => setPurposeOfTravel("Business")}
              />
              <label htmlFor="business">Business</label>
            </InputGroup>
            <Button type="submit">Let's gooo!</Button>
          </SearchForm>
        </SearchContainer>
      </MainContent>
    </PageContainer>
  );
};

export default VisaSearch;
