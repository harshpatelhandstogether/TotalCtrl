import api from "../api/api";
import API_ENDPOINTS from "../api/apiEndpoints";

export default async function uploadExcelFile( payload) {
  try {
    const response = await api.post(
        API_ENDPOINTS.UPLOADEXCELFILE,
        payload,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
            "Content-Type": "application/json",
          },
        },
      );
    return response;
  } catch (error) {
    console.error("Error fetching units:", error);
    throw error;
  }
}