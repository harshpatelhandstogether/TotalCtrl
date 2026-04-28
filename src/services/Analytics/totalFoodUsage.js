import api from "../api/api";
import { format } from "date-fns";

export const fetchTotalFoodUsage = async (fromDate, toDate , inventoryId) => {
  try {
    const response = await api.get("analytics/food-usage/total", {
      params: {
        fromDate: format(new Date(fromDate), "yyyy-MM-dd"),
        toDate: format(new Date(toDate), "yyyy-MM-dd"),
        inventoryId: inventoryId,
      },
    });
    return response.data.Data;
  } catch (error) {
    console.error("Error fetching total food usage:", error);
    throw error;
  }
};
