

const API_ENDPOINTS = {
  INVENTORY_LIST: "/inventory/me/access",
  PRODUCTS: "/inventory-management/store-products",
  DELETE_ITEM: (itemId) => `/inventory-management/store-products/${itemId}`,
  STOCK_VALUE: "/inventory-management/store-products/stock-value",
  SUPPLIERS: "/suppliers",
  EDIT_ITEM: (itemId) => `/inventory-management/store-products/${itemId}`,
  UNITS: "/master-data/measurement-units?types=purchaseUnit",
  UPLOADEXCELFILE: "/inventory-management/store-products/parse-excel",
  SEARCH_PRODUCTS: (searchInput) => `/inventory-management/store-products/search?name=${searchInput}`,
  ADD_ITEM: "/products/add-initial",
};

export default API_ENDPOINTS;