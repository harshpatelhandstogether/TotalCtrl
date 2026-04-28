import api from "../api/api";
import API_ENDPOINTS from "../api/apiEndpoints";

export default async function fetchSupplier() {
      
      try {
        const response = await api.get(API_ENDPOINTS.SUPPLIERS, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
          },
        });

        return response.data.Data;
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        throw error;
      } 
    };
