import api from "../../api/api";
import { format } from "date-fns";

export const foodWasteByCause = async (inventoryId, fromDate, toDate) => {
  try {
    const response = await api.get("/analytics/food-waste/foodwaste-by-cause", {
      params: {
        inventoryId,
        fromDate: format(new Date(fromDate), "yyyy-MM-dd"),
        toDate: format(new Date(toDate), "yyyy-MM-dd"),
        language: "eg",
      },
    });
    return response.data.Data;
  } catch (error) {
    console.error("Error fetching food waste by cause:", error);
    throw error;
  }
};