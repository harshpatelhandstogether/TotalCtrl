import { createSlice } from "@reduxjs/toolkit";
import { startOfMonth, endOfMonth , format} from "date-fns";

const DATE_FORMAT = "yyyy-MM-dd";


const getCurrentMonthRange = () => ({
  startDate: format(startOfMonth(new Date()), DATE_FORMAT),
  endDate: format(endOfMonth(new Date()), DATE_FORMAT),
});

const initialState = {
  activeTab: "Inventory Stats",
  byKey: {
    invCheckIn: getCurrentMonthRange(),
    invCheckOut: getCurrentMonthRange(),
    foodrange: getCurrentMonthRange(),
    Purchases: getCurrentMonthRange(),
    foodUsage: getCurrentMonthRange(),
  },
};

const analyticSlice = createSlice({
  name: "analytic",
  initialState: initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setFoodRange: (state, action) => {
      const { key, startDate, endDate } = action.payload;

      state.byKey[key] = {
        startDate,
        endDate,
       
      };
    },
  },
});

export const { setActiveTab, setFoodRange } = analyticSlice.actions;
export default analyticSlice.reducer;
