import api from '@/lib/api';

export interface LoginResponse {
  access_token: string;
  // Note: Backend only returns access_token, user info is in JWT payload
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginData): Promise<LoginResponse> {
    console.log('🚀 Making login request to:', api.defaults.baseURL + '/auth/login');
    console.log('📤 Request payload:', credentials);
    try {
      const response = await api.post('/auth/login', credentials);
      console.log('✅ Login successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Login failed:', error.response?.data || error.message);
      console.error('❌ Status:', error.response?.status);
      console.error('❌ Full error:', error);
      throw error;
    }
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};
