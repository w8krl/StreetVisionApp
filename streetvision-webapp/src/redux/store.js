import { configureStore } from "@reduxjs/toolkit";
import cameraReducer from "./features/cameras/cameraSlice";

export const store = configureStore({
  reducer: {
    cameras: cameraReducer,
  },
});
