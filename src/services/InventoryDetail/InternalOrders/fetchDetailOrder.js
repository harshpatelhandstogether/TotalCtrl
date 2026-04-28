import api from "../../api/api";

export const fetchDetailOrder = async (orderId) => {
  try {
    console.log("Fetching order details for orderId:", orderId);
    const response = await api.get(`/internal-order/${orderId}`);
    console.log("Fetched order details response:", response.data?.Data);
    return response.data?.Data || null;
  } catch (error) {
    console.error("Error fetching internal order details:", error);
    throw error;
  }
};
