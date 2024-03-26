import { createSlice } from "@reduxjs/toolkit";

const travelSlice = createSlice({
  name: "travel",
  initialState: {
    fromCountry: "",
    toCountry: "",
    purposeOfTravel: "",
  },
  reducers: {
    setFromCountry: (state, action) => {
      state.fromCountry = action.payload;
    },
    setToCountry: (state, action) => {
      state.toCountry = action.payload;
    },
    setPurposeOfTravel: (state, action) => {
      state.purposeOfTravel = action.payload;
    },
  },
});

export const { setFromCountry, setToCountry, setPurposeOfTravel } =
  travelSlice.actions;

export default travelSlice.reducer;
