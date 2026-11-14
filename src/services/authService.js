import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';
import { safeStorage } from '../utils/safeStorage';

export const authService = {
  async register(name, email, password) {
    const res = await apiClient.post(ENDPOINTS.REGISTER, { name, email, password });
    if (res.data && res.data.token) {
      safeStorage.setItem('kochee_auth_token', res.data.token);
      safeStorage.setJSON('kochee_auth_user', res.data.user);
    }
    return res.data;
  },

  async login(email, password) {
    const res = await apiClient.post(ENDPOINTS.LOGIN, { email, password });
    if (res.data && res.data.token) {
      safeStorage.setItem('kochee_auth_token', res.data.token);
      safeStorage.setJSON('kochee_auth_user', res.data.user);
      if (res.data.user?.role === 'admin') {
        safeStorage.setItem('kochee_admin_token', res.data.token);
      }
    }
    return res.data;
  },

  async getProfile() {
    const res = await apiClient.get(ENDPOINTS.PROFILE);
    return res.data;
  },

  logout() {
    safeStorage.removeItem('kochee_auth_token');
    safeStorage.removeItem('kochee_auth_user');
    safeStorage.removeItem('kochee_admin_token');
  },

  getCurrentUser() {
    return safeStorage.getJSON('kochee_auth_user', null);
  },

  isAuthenticated() {
    return !!safeStorage.getItem('kochee_auth_token');
  }
};


