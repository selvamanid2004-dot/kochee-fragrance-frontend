import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';

export const uploadService = {
  /**
   * Upload single image file
   * @param {File} file 
   * @returns {Promise<{ url: string, filename: string, relativeUrl: string }>}
   */
  async uploadSingle(file) {
    const formData = new FormData();
    formData.append('image', file);
    const res = await apiClient.upload(ENDPOINTS.UPLOAD_SINGLE, formData);
    return res.data;
  },

  /**
   * Upload multiple image files
   * @param {File[]} files 
   * @returns {Promise<{ urls: string[], files: Array }>}
   */
  async uploadMultiple(files) {
    const formData = new FormData();
    for (const f of files) {
      formData.append('images', f);
    }
    const res = await apiClient.upload(ENDPOINTS.UPLOAD_MULTIPLE, formData);
    return res.data;
  }
};

