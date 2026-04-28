import api from "../../api/api";

export const fetchFoodUsageProduct = async (fromDate, toDate , inventoryId) => {
  try {
    const response = await api.get("analytics/food-usage/product", {
      params: {
        fromDate: fromDate,
        toDate: toDate,
        inventoryId: inventoryId,
      },
    });
    return response.data.Data;
  } catch (error) {
    console.error("Error fetching food usage product:", error);
    throw error;
  }
};
