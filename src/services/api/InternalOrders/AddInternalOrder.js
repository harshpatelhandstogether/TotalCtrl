import api from "../api";

export const addInternalOrder = async (payload) => {
  try {
    console.log("Adding internal order with payload:", payload);
    const response = await api.post(`/internal-order`, payload);
    console.log("Add internal order response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding internal order:", error);
    throw error;
  }
};