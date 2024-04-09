import { createSlice } from "@reduxjs/toolkit";

const setRegionSlice = createSlice({
  name: "region",
  initialState: {
    selectedRegion: "",
  },
  reducers: {
    setRegion: (state, action) => {
      state.selectedRegion = action.payload;
    },
  },
});

export const { setRegion } = setRegionSlice.actions;

export default setRegionSlice.reducer;
