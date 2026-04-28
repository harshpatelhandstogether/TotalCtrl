import api from "../api/api";
import API_ENDPOINTS from "../api/apiEndpoints";

export default async function addItems(payload) {
  try {
    const response = await api.post(API_ENDPOINTS.ADD_ITEM, payload);
    return response.data.Data;
  } catch (error) {
    console.error("Error fetching units:", error);
    throw error;
  }
}
