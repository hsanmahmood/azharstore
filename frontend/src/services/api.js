import axios from 'axios';

const API_BASE_URL = 'https://api.azhar.store/api';

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

export const orderService = {
  getAllOrders: () => api.get('/admin/orders'),
  getOrder: (id) => api.get(`/admin/orders/${id}`),
  createOrder: (data) => api.post('/admin/orders', data),
  updateOrder: (id, data) => api.patch(`/admin/orders/${id}`, data),
  deleteOrder: (id) => api.delete(`/admin/orders/${id}`),
};

export default api;
