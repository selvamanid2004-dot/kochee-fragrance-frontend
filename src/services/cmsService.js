import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';

export const cmsService = {
  async getPages(all = false) {
    const res = await apiClient.get(`${ENDPOINTS.CMS_PAGES}${all ? '?all=true' : ''}`);
    return res.data;
  },

  async getPageBySlug(slug) {
    const res = await apiClient.get(ENDPOINTS.CMS_PAGE_BY_SLUG(slug));
    return res.data;
  },

  async createPage(data) {
    const res = await apiClient.post(ENDPOINTS.CMS_PAGES, data);
    return res.data;
  },

  async updatePage(id, data) {
    const res = await apiClient.put(ENDPOINTS.CMS_PAGE_BY_ID(id), data);
    return res.data;
  },

  async deletePage(id) {
    const res = await apiClient.delete(ENDPOINTS.CMS_PAGE_BY_ID(id));
    return res.data;
  }
};

