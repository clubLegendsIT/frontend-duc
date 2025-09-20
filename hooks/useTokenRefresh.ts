import { useEffect } from 'react';
import { authService } from '@/services/authService';

export const useTokenRefresh = () => {
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = authService.getToken();
      if (!token) return;

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        // Refresh token 5 minutes before expiration
        if (payload.exp - currentTime < 300) {
          authService.refreshToken().catch(() => {
            // If refresh fails, redirect to login
            window.location.href = '/login';
          });
        }
      } catch (error) {
        console.error('Token validation error:', error);
      }
    };

    // Check immediately and then every minute
    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(interval);
  }, []);
};