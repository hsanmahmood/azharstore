import apiClient from './apiClient';

const productsApi = {
  getAll: () => apiClient.get('/admin/products'),
  create: (data) => apiClient.post('/admin/products', data),
  update: (id, data) => apiClient.patch(`/admin/products/${id}`, data),
  delete: (id) => apiClient.delete(`/admin/products/${id}`),
};

export default productsApi;
