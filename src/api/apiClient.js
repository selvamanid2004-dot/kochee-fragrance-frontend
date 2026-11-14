import { API_BASE_URL } from './endpoints';
import { safeStorage } from '../utils/safeStorage';

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.inFlightRequests = new Map();
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    const token = safeStorage.getItem('kochee_admin_token') || safeStorage.getItem('kochee_auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const method = (options.method || 'GET').toUpperCase();
    const url = `${this.baseURL}${endpoint}`;

    // In-flight deduplication for concurrent identical GET requests
    if (method === 'GET' && !options.skipDedupe) {
      if (this.inFlightRequests.has(url)) {
        return this.inFlightRequests.get(url);
      }
    }

    const headers = {
      ...this.getHeaders(),
      ...options.headers
    };

    const config = {
      ...options,
      headers
    };

    const fetchPromise = (async () => {
      try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || `Request failed with status ${response.status}`);
        }

        return data;
      } catch (error) {
        console.error(`[API Error] ${method} ${url}:`, error.message);
        throw error;
      } finally {
        if (method === 'GET') {
          this.inFlightRequests.delete(url);
        }
      }
    })();

    if (method === 'GET' && !options.skipDedupe) {
      this.inFlightRequests.set(url, fetchPromise);
    }

    return fetchPromise;
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body)
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  async upload(endpoint, formData, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = safeStorage.getItem('kochee_admin_token') || safeStorage.getItem('kochee_auth_token');
    const headers = { ...options.headers };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Upload failed with status ${response.status}`);
      }
      return data;
    } catch (error) {
      console.error(`[API Upload Error] ${url}:`, error.message);
      throw error;
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

