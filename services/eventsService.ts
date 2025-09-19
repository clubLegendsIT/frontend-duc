import api from '@/lib/api';

export interface EventData {
  id?: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const eventsService = {
  async getAll() {
    const response = await api.get('/events');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  async create(data: Omit<EventData, 'id' | 'createdAt' | 'updatedAt'>) {
    const response = await api.post('/events', data);
    return response.data;
  },

  async update(id: string, data: Partial<EventData>) {
    const response = await api.patch(`/events/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
};
