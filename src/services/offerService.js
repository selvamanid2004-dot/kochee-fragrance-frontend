import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';

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
    return res.data;
  },

  async updateOffer(id, data) {
    const res = await apiClient.put(ENDPOINTS.OFFER_BY_ID(id), data);
    return res.data;
  },

  async deleteOffer(id) {
    const res = await apiClient.delete(ENDPOINTS.OFFER_BY_ID(id));
    return res.data;
  }
};

