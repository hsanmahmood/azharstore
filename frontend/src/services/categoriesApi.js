import apiClient from './apiClient';

const categoriesApi = {
  getAll: () => apiClient.get('/admin/categories'),
  create: (data) => apiClient.post('/admin/categories', data),
  update: (id, data) => apiClient.patch(`/admin/categories/${id}`, data),
  delete: (id) => apiClient.delete(`/admin/categories/${id}`),
};

export default categoriesApi;
