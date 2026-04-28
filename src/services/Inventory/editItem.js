import api from "../api/api";
import API_ENDPOINTS from "../api/apiEndpoints";

export const editItem = async (itemId, updatedData) => {
  try {
    const response = await api.put(API_ENDPOINTS.EDIT_ITEM(itemId), updatedData);
    return response.data;
  } catch (error) {
    console.error("Error editing item:", error);
    throw error;
  }
};