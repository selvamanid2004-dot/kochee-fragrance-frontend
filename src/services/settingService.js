import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';

export const settingService = {
  async getSettings() {
    const res = await apiClient.get(ENDPOINTS.SETTINGS);
    return res.data;
  },

  async updateSettings(settings) {
    const res = await apiClient.put(ENDPOINTS.SETTINGS, settings);
    return res.data;
  }
};
