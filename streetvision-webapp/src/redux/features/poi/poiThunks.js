import axios from "axios";
import { fetchPoisBegin, fetchPoisSuccess, fetchPoisFailure } from "./poiSlice";

export const fetchPois = () => async (dispatch) => {
  dispatch(fetchPoisBegin());
  try {
    const response = await axios.get("http://localhost:9000/api/getPoiStatus");
    dispatch(fetchPoisSuccess(response.data));
  } catch (error) {
    dispatch(fetchPoisFailure(error.toString()));
  }
};
