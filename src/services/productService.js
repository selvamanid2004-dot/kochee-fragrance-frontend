import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';
import { bootstrapService } from './bootstrapService';

export const productService = {
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.gender) query.append('gender', params.gender);
    if (params.search) query.append('search', params.search);
    if (params.featured !== undefined) query.append('featured', params.featured);
    if (params.all) query.append('all', 'true');

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await apiClient.get(`${ENDPOINTS.PRODUCTS}${queryString}`);
    return res.data;
  },

  async getProductBySlug(slug) {
    const res = await apiClient.get(ENDPOINTS.PRODUCT_BY_SLUG(slug));
    return res.data;
  },

  async getProductById(id) {
    const res = await apiClient.get(ENDPOINTS.PRODUCT_BY_ID(id));
    return res.data;
  },

  async createProduct(data) {
    const res = await apiClient.post(ENDPOINTS.PRODUCTS, data);
    bootstrapService.clearCache();
    return res.data;
  },

  async updateProduct(id, data) {
    const res = await apiClient.put(ENDPOINTS.PRODUCT_BY_ID(id), data);
    bootstrapService.clearCache();
    return res.data;
  },

  async updateStock(id, stock, reason = 'Admin manual adjustment') {
    const res = await apiClient.patch(ENDPOINTS.UPDATE_STOCK(id), { stock, reason });
    bootstrapService.clearCache();
    return res.data;
  },

  async bulkUpload(products) {
    const res = await apiClient.post(ENDPOINTS.BULK_UPLOAD, { products });
    bootstrapService.clearCache();
    return res.data;
  },

  async getStockLogs(limit = 100) {
    const res = await apiClient.get(`${ENDPOINTS.STOCK_LOGS}?limit=${limit}`);
    return res.data;
  },

  async deleteProduct(id) {
    const res = await apiClient.delete(ENDPOINTS.PRODUCT_BY_ID(id));
    bootstrapService.clearCache();
    return res.data;
  }
};
