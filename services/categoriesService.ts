import api from '@/lib/api';

export interface CategoryData {
  id?: string;
  name: string;
  description: string;
  itemCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const categoriesService = {
  async getAll() {
    const response = await api.get('/categories');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  async create(data: Omit<CategoryData, 'id' | 'itemCount' | 'createdAt' | 'updatedAt'>) {
    const response = await api.post('/categories', data);
    return response.data;
  },

  async update(id: string, data: Partial<CategoryData>) {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};
