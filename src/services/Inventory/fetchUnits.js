import api from "../api/api";
import API_ENDPOINTS from "../api/apiEndpoints";

export default async function fetchUnits() {
  try {
    const response = await api.get(
      API_ENDPOINTS.UNITS);
    return response.data.Data;
  } catch (error) {
    console.error("Error fetching units:", error);
    throw error;
  }
}
