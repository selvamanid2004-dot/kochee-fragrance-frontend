import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';

export const customerService = {
  async getCustomers() {
    const res = await apiClient.get(ENDPOINTS.CUSTOMERS);
    return res.data;
  },

  async getCustomerById(id) {
    const res = await apiClient.get(ENDPOINTS.CUSTOMER_BY_ID(id));
    return res.data;
  },

  async updateCustomerStatus(id, status) {
    const res = await apiClient.patch(ENDPOINTS.CUSTOMER_STATUS(id), { status });
    return res.data;
  }
};

