import { createSlice } from "@reduxjs/toolkit";

const inventoryIdSlice = createSlice({
  name: "inventoryId",
  initialState: {
    inventoryId: ["5ce50596-3cb7-4ea2-b9d1-cd14736deace"],
    inventoryList: [],
    loading: false,
    error: null,
  },
  reducers: {
    setInventoryId: (state, action) => {
      state.inventoryId = action.payload;
    },
    setInventoryList: (state, action) => {
      state.inventoryList = action.payload;
    },
  },
});

export const { setInventoryId, setInventoryList } = inventoryIdSlice.actions;

export default inventoryIdSlice.reducer;
