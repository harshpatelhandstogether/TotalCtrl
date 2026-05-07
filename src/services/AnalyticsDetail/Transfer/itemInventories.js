import api from '../../api/api';
import { format } from 'date-fns';

export const fetchItemInventories = async (inventoryId, startDate, endDate) => {
  try {
    const response = await api.get(`/analytics/transfer/item-inventories`, {
      params: {
        inventoryId,
        fromDate: format(new Date(startDate), 'yyyy-MM-dd'),
        toDate: format(new Date(endDate), 'yyyy-MM-dd'),
      }
    });
    return response.data?.Data;
  } catch (error) {
    console.error('Error fetching item inventories:', error);
    throw error;
  }
};