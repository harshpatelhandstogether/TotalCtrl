import api from "../../api/api";

export const fetchCheckInValueByCategory = async (inventoryId , limit , offset ,fromDate, toDate) => {
  try {
    const response = await api.get("analytics/inventory/check-in-value-by-category",{
      params: {
        inventoryId: inventoryId,
        limit: limit,
        offset: offset,
        fromDate: fromDate,
        toDate: toDate
      }
    });
    return response.data.Data;
  } catch (error) {
    console.error("Error fetching check-in value by category:", error);
    throw error;
  }
};