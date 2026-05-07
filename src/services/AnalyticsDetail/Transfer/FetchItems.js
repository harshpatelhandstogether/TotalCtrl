import api from '../../api/api';
import { format } from 'date-fns';

export const fetchItems = async (
  inventoryId,
  startDate,
  endDate,
  transferFilter,
  selectedItem,
) => {
  try {
    const involvedInventoryIds = Array.isArray(selectedItem)
      ? selectedItem
      : selectedItem?.involvedInventoryIds
        ? selectedItem.involvedInventoryIds
        : selectedItem
          ? [selectedItem]
          : [];

    const response = await api.get(`/analytics/transfer/items`, {
      params: {
        inventoryId: inventoryId,
        fromDate: format(new Date(startDate), 'yyyy-MM-dd'),
        toDate: format(new Date(endDate), 'yyyy-MM-dd'),
        userId: "933c82a7-1368-4ee3-8b98-36f2735b2d6a",
        transferType: transferFilter, // "1" for Transferred In, "2" for Transferred Out, "1,2" for both
        involvedInventoryIds: involvedInventoryIds.join(","),
        sortBy: "date",
        sortOrder: "desc",
        limit: 100,
        offset: 0,
      }
    });
    return response.data?.Data || [];
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};