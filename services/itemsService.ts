import api from '@/lib/api';

export interface ItemData {
  id?: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  isAvailable: boolean;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const itemsService = {
  async getAll() {
    const response = await api.get('/items');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  async create(data: Omit<ItemData, 'id' | 'category' | 'createdAt' | 'updatedAt'>) {
    const response = await api.post('/items', data);
    return response.data;
  },

  async update(id: string, data: Partial<ItemData>) {
    const response = await api.patch(`/items/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  },
};
