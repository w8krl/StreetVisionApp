import axios from "axios";
import {
  fetchRegionsBegin,
  fetchRegionsSuccess,
  fetchRegionsFailure,
} from "./regionSlice";

export const fetchRegions = () => async (dispatch) => {
  dispatch(fetchRegionsBegin());
  try {
    const response = await axios.get("http://localhost:9001/api/getRegions");
    dispatch(fetchRegionsSuccess(response.data));
  } catch (error) {
    dispatch(fetchRegionsFailure(error.toString()));
  }
};
