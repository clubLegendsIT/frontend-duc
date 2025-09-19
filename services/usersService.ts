import api from '@/lib/api';

export interface UserData {
  id?: string;
  email: string;
  name?: string;
  role: 'Admin' | 'SuperAdmin';
  isActive: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  name?: string;
  role: 'Admin' | 'SuperAdmin';
  isActive: boolean;
}

export interface UpdateUserData {
  email?: string;
  password?: string;
  name?: string;
  role?: 'Admin' | 'SuperAdmin';
  isActive?: boolean;
}

export const usersService = {
  async getAll() {
    const response = await api.get('/users');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async create(data: CreateUserData) {
    const response = await api.post('/users', data);
    return response.data;
  },

  async update(id: string, data: UpdateUserData) {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
