import api from "../../api/api";
import { format } from "date-fns";

export const totalFoodWaste = async (inventoryId, fromDate, toDate) => {
  try {
    const response = await api.get("/analytics/food-waste/total-foodwaste", {
      params: {
        fromDate: format(new Date(fromDate), "yyyy-MM-dd"),
        toDate: format(new Date(toDate), "yyyy-MM-dd"),
        language: "nb",
        inventoryId: inventoryId,
      },
    });
    return response.data.Data;
  } catch (error) {
    console.error("Error fetching total food waste:", error);
    throw error;
  }
}       