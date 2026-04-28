import api from "../api/api";
import API_ENDPOINTS from "../api/apiEndpoints";

export default async function fetchProducts(
  debouncedQuery,
  selectedInventoryId,
  supplierId,
  filter,
  sortConfig,
  limit = 20,
  offset = 0,
) {
  try {
    const response = await api.get(API_ENDPOINTS.PRODUCTS, {
      params: {
        name: debouncedQuery,
        inventoryId: selectedInventoryId,
        supplierIds: supplierId, // "" = ALL suppliers
        isInStock: filter,
        sortBy: sortConfig.key,
        sortOrder: sortConfig.direction,
        limit,
        offset,
        language: "en",
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
      },
    });

    return response.data.Data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}
