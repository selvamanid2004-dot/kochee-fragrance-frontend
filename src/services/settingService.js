import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';
import { bootstrapService } from './bootstrapService';

export const settingService = {
  async getSettings() {
    const res = await apiClient.get(ENDPOINTS.SETTINGS);
    return res.data;
  },

  async updateSettings(settings) {
    const res = await apiClient.put(ENDPOINTS.SETTINGS, settings);
    bootstrapService.clearCache();
    return res.data;
  }
};
