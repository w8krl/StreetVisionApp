import axios from "axios";
import {
  fetchCountriesBegin,
  fetchCountriesSuccess,
  fetchCountriesFailure,
} from "./countrySlice";

export const fetchCountries = () => async (dispatch) => {
  dispatch(fetchCountriesBegin());
  try {
    const response = await axios.get("http://localhost:9001/api/get-countries");
    dispatch(fetchCountriesSuccess(response.data));
  } catch (error) {
    dispatch(fetchCountriesFailure(error.toString()));
  }
};
