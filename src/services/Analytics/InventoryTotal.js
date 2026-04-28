import api from "../api/api";

export const fetchInventoryTotal = async (inventoryId) => {
  try {
    const response = await api.get("analytics/inventory/total",{
      params: {
        inventoryId: inventoryId,
      }
    });
    return response.data.Data;
  } catch (error) {
    console.error("Error fetching inventory total:", error);
    throw error;
  }
};