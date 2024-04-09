import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Pois: [],
  loading: false,
  error: null,
};

const poiSlice = createSlice({
  name: "pois",
  initialState,
  reducers: {
    fetchPoisBegin: (state) => {
      state.loading = true;
    },
    fetchPoisSuccess: (state, action) => {
      state.loading = false;
      state.Pois = action.payload;
    },
    fetchPoisFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchPoisBegin, fetchPoisSuccess, fetchPoisFailure } =
  poiSlice.actions;

export default poiSlice.reducer;
