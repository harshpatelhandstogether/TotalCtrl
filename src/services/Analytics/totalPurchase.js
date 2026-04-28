import api from '../api/api';

export const getTotalPurchase = async (fromDate, toDate) => {
  try {
    const response = await api.get('/analytics/purchase/total', {
        params: {
            fromDate: fromDate,
            toDate: toDate,
            userId: '933c82a7-1368-4ee3-8b98-36f2735b2d6a'
        }
    });
    console.log('Total purchase response:', response.data.Data);
    return response.data.Data;
  } catch (error) {
    console.error('Error fetching total purchase:', error);
    throw error;
  }
};  