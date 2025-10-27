import { api } from './api';

export const getProducts = () => api.get('/api/admin/products');
export const createProduct = (data) => api.post('/api/admin/products', data);
export const updateProduct = (id, data) => api.patch(`/api/admin/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/api/admin/products/${id}`);
