import api from "../api/api";
import API_ENDPOINTS from "../api/apiEndpoints";


export default async function fetchSearchProduct( searchInput) {
  try {
    const response = await api.get(
      `${API_ENDPOINTS.SEARCH_PRODUCTS(searchInput)}`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
        },
      },
    );
    return response.data.Data;
  } catch (error) {
    console.error("Error fetching search product:", error);
    throw error;
  }
}
