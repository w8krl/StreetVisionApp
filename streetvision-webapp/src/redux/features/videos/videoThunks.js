import axios from "axios";
import {
  fetchVideosBegin,
  fetchVideosSuccess,
  fetchVideosFailure,
} from "./videoSlice";

export const fetchVideos = () => async (dispatch) => {
  dispatch(fetchVideosBegin());
  try {
    const response = await axios.get("http://localhost:9000/api/videos");
    dispatch(fetchVideosSuccess(response.data));
  } catch (error) {
    const errorPayload = error.response ? error.response.data : error.message;
    dispatch(fetchVideosFailure(errorPayload));
  }
};
