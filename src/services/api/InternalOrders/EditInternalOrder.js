import api from "../api";

export const editInternalOrder = async (payload, orderId) => {
  try {
    console.log("Editing internal order with payload:", payload);
    const response = await api.put(`/internal-order/${orderId}`, payload);
    console.log("Edit internal order response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error editing internal order:", error);
    throw error;
  }
};  