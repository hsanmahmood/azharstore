import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.azhar.store/api';

const deliveryApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

deliveryApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('deliveryToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

deliveryApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('deliveryToken');
      window.location.href = '/orders/login';
    }
    return Promise.reject(error);
  }
);

export const deliveryApiService = {
  login: (password) => deliveryApi.post('/delivery/login', { password }),
  getAllOrders: () => deliveryApi.get('/delivery/orders'),
};

export default deliveryApi;
