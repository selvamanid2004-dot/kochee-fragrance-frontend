import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';

export const contactService = {
  async submitContact(formData) {
    const res = await apiClient.post(ENDPOINTS.CONTACT, formData);
    return res.data;
  },

  async getAllContacts() {
    const res = await apiClient.get(ENDPOINTS.CONTACT);
    return res.data;
  },

  async updateContactStatus(id, status) {
    const res = await apiClient.patch(ENDPOINTS.CONTACT_STATUS(id), { status });
    return res.data;
  }
};

