import { api } from './api';

export const getCategories = () => api.get('/api/admin/categories');
export const createCategory = (data) => api.post('/api/admin/categories', data);
export const updateCategory = (id, data) => api.patch(`/api/admin/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/api/admin/categories/${id}`);
