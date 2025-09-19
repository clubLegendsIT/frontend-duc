"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ("Admin" | "SuperAdmin")[];
}

export default function RoleProtectedRoute({ children, allowedRoles }: RoleProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !allowedRoles.includes(user.role))) {
      router.push("/login");
    }
  }, [user, isLoading, allowedRoles, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!user || !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}