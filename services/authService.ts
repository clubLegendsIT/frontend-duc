import api from '@/lib/api';

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginData): Promise<LoginResponse> {
    const response = await api.post('/auth/login', credentials);
    const { access_token, refresh_token } = response.data;
    
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    
    return response.data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post('/auth/refresh', {
      refresh_token: refreshToken
    });
    
    const { access_token } = response.data;
    localStorage.setItem('access_token', access_token);
    
    return access_token;
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
};
