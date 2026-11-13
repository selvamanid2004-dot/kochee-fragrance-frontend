export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/auth/profile',

  // Uploads
  UPLOAD_SINGLE: '/upload/single',
  UPLOAD_MULTIPLE: '/upload/multiple',

  // Customers
  CUSTOMERS: '/customers',
  CUSTOMER_BY_ID: (id) => `/customers/${id}`,
  CUSTOMER_STATUS: (id) => `/customers/${id}/status`,

  // Products
  PRODUCTS: '/products',
  PRODUCT_BY_SLUG: (slug) => `/products/slug/${slug}`,
  PRODUCT_BY_ID: (id) => `/products/${id}`,
  UPDATE_STOCK: (id) => `/products/${id}/stock`,
  BULK_UPLOAD: '/products/bulk-upload',
  STOCK_LOGS: '/products/stock/logs',

  // Categories
  CATEGORIES: '/categories',
  CATEGORY_BY_SLUG: (slug) => `/categories/slug/${slug}`,
  CATEGORY_BY_ID: (id) => `/categories/${id}`,

  // Orders
  ORDERS: '/orders',
  MY_ORDERS: '/orders/my-orders',
  ORDER_BY_ID: (id) => `/orders/${id}`,
  ORDER_TRACK: (orderNumber) => `/orders/track/${orderNumber}`,
  ORDER_STATUS: (id) => `/orders/${id}/status`,
  ORDER_STATISTICS: '/orders/statistics',

  // CMS
  CMS_PAGES: '/cms',
  CMS_PAGE_BY_SLUG: (slug) => `/cms/slug/${slug}`,
  CMS_PAGE_BY_ID: (id) => `/cms/${id}`,

  // Offers & Promotions
  OFFERS: '/offers',
  ACTIVE_OFFERS: '/offers/active',
  OFFER_BY_ID: (id) => `/offers/${id}`,

  // Global Settings & Branding
  SETTINGS: '/settings',

  // Contact
  CONTACT: '/contact',
  CONTACT_STATUS: (id) => `/contact/${id}/status`
};
