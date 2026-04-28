import api from "../../api/api";

export const fetchValueByStock = async (inventoryId , limit , offset) => {
  try {
    const response = await api.get("analytics/inventory/value-by-stock",{
      params: {
        inventoryId: inventoryId,
        limit: limit,
        offset: offset,
      }
    });
    return response.data.Data.Data;
  } catch (error) {
    console.error("Error fetching value by stock:", error);
    throw error;
  }
};