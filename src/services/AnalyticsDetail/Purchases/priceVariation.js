import api from '../../api/api';
import format from 'date-fns/format';


export const priceVariation = async (inventoryId, fromDate, toDate) => {
  try {
    const response = await api.get(
      `/analytics/purchase/price-variations`,{
        params: {
          inventoryId: inventoryId,
          fromDate: format(new Date(fromDate), 'yyyy-MM-dd'),
          toDate: format(new Date(toDate), 'yyyy-MM-dd'),
        },
      }
    );
    return response.data?.Data;
  } catch (error) {
    console.error('Error fetching price variation:', error);
    throw error;
  }
};