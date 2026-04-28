import api from "../../api/api";

export const fetchOrders = async (inventoryId, status) => {
  try {
    console.log("Fetching orders with inventoryId:", inventoryId, "and status:", status);
    const response = await api.get(
      `/internal-order?status=${status}&inventoryId=${inventoryId}&limit=20&offset=0&language=en`
    );
    console.log("Fetched orders response:", response.data?.Data);
    return response.data?.Data || [];
  } catch (error) {
    console.error("Error fetching internal orders:", error);
    throw error;
  }
};