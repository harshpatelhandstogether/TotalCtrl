import api from '../../api/api';
import { format } from 'date-fns';

export const foodWasteByCategory = async (inventoryId, fromDate, toDate) => {
  try {
    const response = await api.get('/analytics/food-waste/foodwaste-by-category', {
      params: {
        inventoryId,
        fromDate: format(new Date(fromDate), 'yyyy-MM-dd'),
        toDate: format(new Date(toDate), 'yyyy-MM-dd'),
        language : 'eg',
      },
    });
    return response.data.Data;
  } catch (error) {
    console.error('Error fetching food waste by category:', error);
    throw error;
  }
};
        