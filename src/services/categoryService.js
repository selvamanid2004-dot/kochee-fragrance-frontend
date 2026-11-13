import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';

export const categoryService = {
  async getCategories() {
    const res = await apiClient.get(ENDPOINTS.CATEGORIES);
    return res.data;
  },

  async getCategoryBySlug(slug) {
    const res = await apiClient.get(ENDPOINTS.CATEGORY_BY_SLUG(slug));
    return res.data;
  },

  async createCategory(data) {
    const res = await apiClient.post(ENDPOINTS.CATEGORIES, data);
    return res.data;
  },

  async updateCategory(id, data) {
    const res = await apiClient.put(ENDPOINTS.CATEGORY_BY_ID(id), data);
    return res.data;
  },

  async deleteCategory(id) {
    const res = await apiClient.delete(ENDPOINTS.CATEGORY_BY_ID(id));
    return res.data;
  }
};

