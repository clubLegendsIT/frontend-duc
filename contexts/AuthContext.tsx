"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";

interface User {
  id: string;
  email: string;
  name?: string;
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
      const storedToken = localStorage.getItem("access_token");
      if (storedToken) {
        try {
          const payload = JSON.parse(atob(storedToken.split('.')[1]));
          setUser({ id: payload.sub, email: payload.email, name: payload.name, role: payload.role });
          setToken(storedToken);
        } catch (error) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      }
      setIsLoading(false);
    }
  }, [isClient]);

  const login = async (email: string, password: string) => {
    try {
      const loginResponse = await authService.login({ email, password });
      const { access_token } = loginResponse;
      
      if (!access_token) {
        throw new Error("No access token received from server");
      }
      
      const payload = JSON.parse(atob(access_token.split('.')[1]));
      const user = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role as "Admin" | "SuperAdmin"
      };
      
      setToken(access_token);
      setUser(user);

      const redirectPath = user.role === "SuperAdmin" ? "/superadmin-dashboard" : "/admin-dashboard";
      router.push(redirectPath);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || "Login failed");
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      router.push("/login");
    }
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