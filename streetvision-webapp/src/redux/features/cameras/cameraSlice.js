import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Cameras: [],
  loading: false,
  error: null,
};

const cameraSlice = createSlice({
  name: "cameras",
  initialState,
  reducers: {
    fetchCamerasBegin: (state) => {
      state.loading = true;
    },
    fetchCamerasSuccess: (state, action) => {
      state.loading = false;
      state.Cameras = action.payload;
    },
    fetchCamerasFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchCamerasBegin, fetchCamerasSuccess, fetchCamerasFailure } =
  cameraSlice.actions;

export default cameraSlice.reducer;
