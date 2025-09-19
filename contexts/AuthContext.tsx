"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";

interface User {
  id: string;
  email: string;
  role: "Admin" | "SuperAdmin";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const payload = JSON.parse(atob(storedToken.split('.')[1]));
          setUser({ id: payload.sub, email: payload.email, role: payload.role });
          setToken(storedToken);
        } catch (error) {
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    }
  }, [isClient]);

  const login = async (email: string, password: string) => {
    try {
      const loginResponse = await authService.login({ email, password });
      console.log('🔍 AuthContext received:', loginResponse);
      
      const { access_token } = loginResponse;
      
      if (!access_token) {
        throw new Error("No access token received from server");
      }
      
      // Decode JWT token to get user info (since backend only returns access_token)
      const payload = JSON.parse(atob(access_token.split('.')[1]));
      console.log('🔍 JWT payload:', payload);
      
      const user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role as "Admin" | "SuperAdmin"
      };
      
      if (isClient) {
        localStorage.setItem("token", access_token);
      }
      setToken(access_token);
      setUser(user);

      const redirectPath = user.role === "SuperAdmin" ? "/superadmin-dashboard" : "/admin-dashboard";
      console.log('🚀 Redirecting to:', redirectPath);
      router.push(redirectPath);
    } catch (error: any) {
      console.error('❌ AuthContext error:', error);
      throw new Error(error.response?.data?.message || error.message || "Login failed");
    }
  };

  const logout = () => {
    if (isClient) {
      localStorage.removeItem("token");
    }
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};