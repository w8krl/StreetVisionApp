import { configureStore } from "@reduxjs/toolkit";
import countryReducer from "./features/country/countrySlice";
import travelReducer from "./features/country/travelSlice";
import regionReducer from "./features/region/regionSlice";
import setregionReducer from "./features/region/setregionSlice";

export const store = configureStore({
  reducer: {
    countries: countryReducer,
    travel: travelReducer,
    regions: regionReducer,
    region: setregionReducer,
  },
});
