import api from '@/lib/api';

export interface ItemVariant {
  id?: string;
  variantName: string;
  price: number;
  sku?: string;
}

export interface ItemImage {
  id?: string;
  imageUrl: string;
  isDefault: boolean;
}

export interface ItemOption {
  id?: string;
  optionName: string;
  optionValue: string;
  optionType?: string;
}

export interface ItemData {
  id?: string;
  name: string;
  description?: string;
  status: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  variants: ItemVariant[];
  images: ItemImage[];
  options: ItemOption[];
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

  async update(id: string, data: Omit<ItemData, 'id' | 'category' | 'createdAt' | 'updatedAt'>) {
    const response = await api.patch(`/items/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  },
};
