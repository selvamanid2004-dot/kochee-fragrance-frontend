import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';

export const authService = {
  async register(name, email, password) {
    const res = await apiClient.post(ENDPOINTS.REGISTER, { name, email, password });
    if (res.data && res.data.token) {
      localStorage.setItem('kochee_auth_token', res.data.token);
      localStorage.setItem('kochee_auth_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async login(email, password) {
    const res = await apiClient.post(ENDPOINTS.LOGIN, { email, password });
    if (res.data && res.data.token) {
      localStorage.setItem('kochee_auth_token', res.data.token);
      localStorage.setItem('kochee_auth_user', JSON.stringify(res.data.user));
      if (res.data.user?.role === 'admin') {
        localStorage.setItem('kochee_admin_token', res.data.token);
      }
    }
    return res.data;
  },

  async getProfile() {
    const res = await apiClient.get(ENDPOINTS.PROFILE);
    return res.data;
  },

  logout() {
    localStorage.removeItem('kochee_auth_token');
    localStorage.removeItem('kochee_auth_user');
    localStorage.removeItem('kochee_admin_token');
  },

  getCurrentUser() {
    const user = localStorage.getItem('kochee_auth_user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('kochee_auth_token');
  }
};

