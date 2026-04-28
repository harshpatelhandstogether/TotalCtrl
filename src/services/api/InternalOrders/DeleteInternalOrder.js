import api from "../api";

export const deleteInternalOrder = async (id) => {
  try {
    console.log("Deleting internal order with ID:", id);
    const response = await api.delete(`/internal-order/${id}`);
    console.log("Delete internal order response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting internal order:", error);
    throw error;
  }
};