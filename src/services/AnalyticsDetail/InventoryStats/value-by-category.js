import api from "../../api/api";

export const fetchValueByCategory = async (inventoryId , limit , offset) => {
  try {
    const response = await api.get("analytics/inventory/value-by-category",{
      params: {
        inventoryId: inventoryId,
        limit: limit,
        offset: offset,
      }
    });
    return response.data.Data.Data;
  } catch (error) {
    console.error("Error fetching value by category:", error);
    throw error;
  }
};