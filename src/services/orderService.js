import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';

export const orderService = {
  async getMyOrders() {
    const res = await apiClient.get(ENDPOINTS.MY_ORDERS);
    return res.data;
  },

  async createOrder(orderData) {
    const res = await apiClient.post(ENDPOINTS.ORDERS, orderData);
    return res.data;
  },

  async trackOrder(orderNumber) {
    const res = await apiClient.get(ENDPOINTS.ORDER_TRACK(orderNumber));
    return res.data;
  },

  async getAllOrders() {
    const res = await apiClient.get(ENDPOINTS.ORDERS);
    return res.data;
  },

  async getOrderById(id) {
    const res = await apiClient.get(ENDPOINTS.ORDER_BY_ID(id));
    return res.data;
  },

  async updateOrderStatus(id, statusData) {
    const payload = typeof statusData === 'string' ? { order_status: statusData } : statusData;
    const res = await apiClient.patch(ENDPOINTS.ORDER_STATUS(id), payload);
    return res.data;
  },

  async getStatistics() {
    const res = await apiClient.get(ENDPOINTS.ORDER_STATISTICS);
    return res.data;
  }
};

