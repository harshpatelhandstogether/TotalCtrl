import api from '../../api/api';
import format from 'date-fns/format';

export const biggestSupplier = async (inventoryId, fromDate, toDate) => {
  try {
    const response = await api.get(
      `analytics/purchase/biggest-suppliers`,{
        params: {
          inventoryId: inventoryId,
          fromDate: format(new Date(fromDate), 'yyyy-MM-dd'),
          toDate: format(new Date(toDate), 'yyyy-MM-dd'),
        },
      }
    );
    return response.data?.Data || [];
  } catch (error) {
    console.error('Error fetching biggest suppliers:', error);
    throw error;
  }
};