import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  countries: [],
  loading: false,
  error: null,
};

const countrySlice = createSlice({
  name: "countries",
  initialState,
  reducers: {
    fetchCountriesBegin: (state) => {
      state.loading = true;
    },
    fetchCountriesSuccess: (state, action) => {
      state.loading = false;
      state.countries = action.payload;
    },
    fetchCountriesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchCountriesBegin,
  fetchCountriesSuccess,
  fetchCountriesFailure,
} = countrySlice.actions;

export default countrySlice.reducer;
