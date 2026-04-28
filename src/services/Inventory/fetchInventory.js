
import api from "../api/api";
import API_ENDPOINTS from "../api/apiEndpoints";

export default async function fetchInventory() {
  try {
    const response = await api.get(API_ENDPOINTS.INVENTORY_LIST, {
      params: { includeInactive: true },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
      },
    });
    return response.data.Data;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw error;
  }
};




