import api from "../api/api";
import API_ENDPOINTS from "../api/apiEndpoints";
 
 export default async function fetchInventoryStockValue(selectedInventoryId) {
      try {
        const response = await api.get(
          API_ENDPOINTS.STOCK_VALUE,
          {
            params: { inventoryId: selectedInventoryId },
          },
        );

        console.log("Stock value API response:", response.data.Data);

        return response.data.Data;
      } catch (error) {
        console.error("Error fetching stock value:", error);
        throw error;
      }
    };