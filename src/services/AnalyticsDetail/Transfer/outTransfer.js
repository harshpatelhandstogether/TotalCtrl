import api from "../../api/api";
import { format } from "date-fns";

export const outTransfer = async (inventoryId, startDate, endDate) => {
  try {
    const response = await api.get(`analytics/transfer/out`, {
      params: {
        fromDate: format(new Date(startDate), "yyyy-MM-dd"),
        toDate: format(new Date(endDate), "yyyy-MM-dd"),
        inventoryId: inventoryId,
        userId: "933c82a7-1368-4ee3-8b98-36f2735b2d6a",
      },
    });
    return response.data?.Data || 0;
  } catch (error) {
    console.error("Error fetching total purchases:", error);
    throw error;
  }
};