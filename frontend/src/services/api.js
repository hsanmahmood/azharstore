import axios from 'axios';

// Use environment variable for API URL, fallback to production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.azhar.store/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getTranslations = () => api.get('/translations').then(res => res.data);
export const getAllTranslations = () => api.get('/translations/all').then(res => res.data);
export const updateTranslation = ({ id, value }) => api.patch(`/admin/translations/${id}`, { value });

// Product services
export const productService = {
  getAllProducts: () => api.get('/products'),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.patch(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  uploadImage: (productId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/admin/products/${productId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteImage: (imageId) => api.delete(`/admin/products/images/${imageId}`),
  setPrimaryImage: (imageId) => api.post(`/admin/products/images/${imageId}/set-primary`),
  createVariant: (productId, data) => api.post(`/admin/products/${productId}/variants`, data),
  updateVariant: (variantId, data) => api.patch(`/admin/products/variants/${variantId}`, data),
  deleteVariant: (variantId) => api.delete(`/admin/products/variants/${variantId}`),
  uploadVariantImage: (variantId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/admin/products/variants/${variantId}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Category services
export const categoryService = {
  getAllCategories: () => api.get('/categories').then(res => res.data),
  getCategory: (id) => api.get(`/categories/${id}`),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.patch(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
};

// Auth services
export const authService = {
  login: (password) => api.post('/login', { password }),
};

// Customer services
export const customerService = {
  getAllCustomers: () => api.get('/admin/customers'),
  getCustomer: (id) => api.get(`/admin/customers/${id}`),
  createCustomer: (data) => api.post('/admin/customers', data),
  updateCustomer: (id, data) => api.patch(`/admin/customers/${id}`, data),
  deleteCustomer: (id) => api.delete(`/admin/customers/${id}`),
};

export const apiService = {
  // Auth
  login: (password) => api.post('/login', { password }),

  // Products
  getAllProducts: () => api.get('/products'),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.patch(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  uploadImage: (productId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/admin/products/${productId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteImage: (imageId) => api.delete(`/admin/products/images/${imageId}`),
  setPrimaryImage: (imageId) => api.post(`/admin/products/images/${imageId}/set-primary`),
  createVariant: (productId, data) => api.post(`/admin/products/${productId}/variants`, data),
  updateVariant: (variantId, data) => api.patch(`/admin/products/variants/${variantId}`, data),
  deleteVariant: (variantId) => api.delete(`/admin/products/variants/${variantId}`),
  uploadVariantImage: (variantId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/admin/products/variants/${variantId}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Categories
  getAllCategories: () => api.get('/categories').then(res => res.data),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.patch(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),

  // Customers
  getAllCustomers: () => api.get('/admin/customers'),
  createCustomer: (data) => api.post('/admin/customers', data),
  updateCustomer: (id, data) => api.patch(`/admin/customers/${id}`, data),
  deleteCustomer: (id) => api.delete(`/admin/customers/${id}`),

  // Orders
  getAllOrders: () => api.get('/admin/orders'),
  createOrder: (data) => api.post('/orders', data),
  updateOrder: (id, data) => api.patch(`/admin/orders/${id}`, data),
  deleteOrder: (id) => api.delete(`/admin/orders/${id}`),

  // Delivery Areas
  getAllDeliveryAreas: () => api.get('/delivery-areas'),
  createDeliveryArea: (data) => api.post('/admin/delivery-areas', data),
  updateDeliveryArea: (id, data) => api.patch(`/admin/delivery-areas/${id}`, data),
  deleteDeliveryArea: (id) => api.delete(`/admin/delivery-areas/${id}`),

  // App Settings
  getAppSettings: () => api.get('/settings'),
  updateAppSettings: (data) => api.patch('/admin/settings', data),

  // Translations
  getTranslations: () => api.get('/translations').then(res => res.data),
  updateTranslation: ({ id, value }) => api.patch(`/admin/translations/${id}`, { value }),

  // General (deprecated, use product upload)
  uploadImage: (productId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/admin/products/${productId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => res.data);
  },
};

export default api;
