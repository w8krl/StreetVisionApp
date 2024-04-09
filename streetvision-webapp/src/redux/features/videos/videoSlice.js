import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Videos: [],
  loading: false,
  error: null,
};

const videoSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    fetchVideosBegin: (state) => {
      state.loading = true;
    },
    fetchVideosSuccess: (state, action) => {
      state.loading = false;
      state.Videos = action.payload;
    },
    fetchVideosFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchVideosBegin, fetchVideosSuccess, fetchVideosFailure } =
  videoSlice.actions;

export default videoSlice.reducer;
