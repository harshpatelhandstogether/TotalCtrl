import api from "../api/api";
import API_ENDPOINTS from "../api/apiEndpoints";

export default async function deleteAddItem(itemId, payload) {
  try {
    const response = await api.delete(API_ENDPOINTS.DELETE_ITEM(itemId), {
      data: payload,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
}