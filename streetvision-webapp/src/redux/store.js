import { configureStore } from "@reduxjs/toolkit";
import cameraReducer from "./features/cameras/cameraSlice";
import videoReducer from "./features/videos/videoSlice";
import poiReducer from "./features/poi/poiSlice";

export const store = configureStore({
  reducer: {
    cameras: cameraReducer,
    videos: videoReducer,
    pois: poiReducer,
  },
});
