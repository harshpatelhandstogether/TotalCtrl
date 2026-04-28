import { createSlice } from "@reduxjs/toolkit";

const analyticSlice = createSlice({
  name: "analytic",
  initialState: {
    activeTab: "Inventory Stats",
  },
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = analyticSlice.actions;

export default analyticSlice.reducer;