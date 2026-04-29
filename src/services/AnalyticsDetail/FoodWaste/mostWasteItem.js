import api from '../../api/api';
import { format } from 'date-fns';

export const mostWasteItem = async (inventoryId, fromDate, toDate) => {
  try {
    const response = await api.get('/analytics/food-waste/most-wasted-items', {
      params: {
        inventoryId,
        fromDate: format(new Date(fromDate), 'yyyy-MM-dd'),
        toDate: format(new Date(toDate), 'yyyy-MM-dd'),     
        language: 'eg',
      },
    });
    return response.data.Data;
  } catch (error) {
    console.error('Error fetching most waste item:', error);
    throw error;
  }
};