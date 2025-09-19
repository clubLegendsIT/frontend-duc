import api from '@/lib/api';

export interface BusinessData {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  hours?: string; // Backend uses 'hours' not 'openingHours'
  logoUrl?: string;
  faviconUrl?: string;
  slogan?: string;
  urlFacebook?: string;
  urlInstagram?: string;
  urlLinkedin?: string;
  uberEatsUrl?: string;
  // Note: city and zipCode are not in backend DTO
}

export const businessService = {
  async getAll() {
    const response = await api.get('/business');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/business/${id}`);
    return response.data;
  },

  async create(data: Omit<BusinessData, 'id'>) {
    const response = await api.post('/business', data);
    return response.data;
  },

  async update(id: string, data: Partial<BusinessData>) {
    const response = await api.patch(`/business/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/business/${id}`);
    return response.data;
  },
};
