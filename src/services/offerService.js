import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';
import { bootstrapService } from './bootstrapService';

export const offerService = {
  async getActiveOffers() {
    const res = await apiClient.get(ENDPOINTS.ACTIVE_OFFERS);
    return res.data;
  },

  async getAllOffers() {
    const res = await apiClient.get(ENDPOINTS.OFFERS);
    return res.data;
  },

  async createOffer(data) {
    const res = await apiClient.post(ENDPOINTS.OFFERS, data);
    bootstrapService.clearCache();
    return res.data;
  },

  async updateOffer(id, data) {
    const res = await apiClient.put(ENDPOINTS.OFFER_BY_ID(id), data);
    bootstrapService.clearCache();
    return res.data;
  },

  async deleteOffer(id) {
    const res = await apiClient.delete(ENDPOINTS.OFFER_BY_ID(id));
    bootstrapService.clearCache();
    return res.data;
  }
};

