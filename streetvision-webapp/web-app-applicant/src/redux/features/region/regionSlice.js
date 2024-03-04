import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  regions: [],
  loading: false,
  error: null,
};

const regionSlice = createSlice({
  name: "regions",
  initialState,
  reducers: {
    fetchRegionsBegin: (state) => {
      state.loading = true;
    },
    fetchRegionsSuccess: (state, action) => {
      state.loading = false;
      state.regions = action.payload;
    },
    fetchRegionsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchRegionsBegin, fetchRegionsSuccess, fetchRegionsFailure } =
  regionSlice.actions;

export default regionSlice.reducer;
