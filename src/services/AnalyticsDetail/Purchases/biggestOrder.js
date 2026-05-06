import api from "../../api/api";
import { format } from "date-fns";

export const biggestOrder = async (inventoryId, startDate, endDate) => {
  try {
    const response = await api.get(`analytics/purchase/biggest-orders`, {
      params: {
        fromDate: format(new Date(startDate), "yyyy-MM-dd"),
        toDate: format(new Date(endDate), "yyyy-MM-dd"),
        inventoryId: inventoryId,
        
      },
    });
    return response.data?.Data || [];
  } catch (error) {
    console.error("Error fetching biggest order:", error);
    throw error;
  }
};