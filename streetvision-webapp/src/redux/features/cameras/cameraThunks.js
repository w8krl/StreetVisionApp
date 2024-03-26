import axios from "axios";
import {
  fetchCamerasBegin,
  fetchCamerasSuccess,
  fetchCamerasFailure,
} from "./cameraSlice";

export const fetchCameras = () => async (dispatch) => {
  dispatch(fetchCamerasBegin());
  try {
    const response = await axios.get("http://localhost:9000/api/cameras");
    dispatch(fetchCamerasSuccess(response.data));
  } catch (error) {
    dispatch(fetchCamerasFailure(error.toString()));
  }
};
