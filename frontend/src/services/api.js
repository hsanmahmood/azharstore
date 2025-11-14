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
};

// Category services
let cachedCategories = null;
export const categoryService = {
  getAllCategories: async () => {
    if (cachedCategories) {
      return cachedCategories;
    }
    const res = await api.get('/categories');
    cachedCategories = res.data;
    return cachedCategories;
  },
  getCategory: (id) => api.get(`/categories/${id}`),
  createCategory: (data) => api.post('/admin/categories', data).then(res => {
    cachedCategories = null; // Invalidate cache
    return res.data;
  }),
  updateCategory: (id, data) => api.patch(`/admin/categories/${id}`, data).then(res => {
    cachedCategories = null; // Invalidate cache
    return res.data;
  }),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`).then(res => {
    cachedCategories = null; // Invalidate cache
    return res.data;
  }),
};

// Auth services
export const authService = {
  login: (password) => api.post('/login', { password }),
};

export default api;
