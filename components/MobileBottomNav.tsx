"use client";

import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Building2, 
  Calendar, 
  Folder, 
  Package, 
  Users,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ClientOnly from "./ClientOnly";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: ("Admin" | "SuperAdmin")[];
}

const adminNavItems: NavItem[] = [
  { 
    href: "/admin-dashboard", 
    label: "Dashboard", 
    icon: Home, 
    roles: ["Admin", "SuperAdmin"] 
  },
  { 
    href: "/admin-dashboard/business", 
    label: "Entreprise", 
    icon: Building2, 
    roles: ["Admin", "SuperAdmin"] 
  },
  { 
    href: "/admin-dashboard/events", 
    label: "Événements", 
    icon: Calendar, 
    roles: ["Admin", "SuperAdmin"] 
  },
  { 
    href: "/admin-dashboard/categories", 
    label: "Catégories", 
    icon: Folder, 
    roles: ["Admin", "SuperAdmin"] 
  },
  { 
    href: "/admin-dashboard/items", 
    label: "Articles", 
    icon: Package, 
    roles: ["Admin", "SuperAdmin"] 
  },
];

const superAdminNavItems: NavItem[] = [
  ...adminNavItems,
  { 
    href: "/superadmin-dashboard/users", 
    label: "Utilisateurs", 
    icon: Users, 
    roles: ["SuperAdmin"] 
  },
];

export default function MobileBottomNav() {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();

  // Prevent hydration mismatch by not rendering until client-side
  if (isLoading || !user) return null;

  const navItems = user.role === "SuperAdmin" ? superAdminNavItems : adminNavItems;
  const availableItems = navItems.filter(item => item.roles.includes(user.role));

  return (
    <ClientOnly>
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
        <div className="grid grid-cols-5 px-1">
          {/* Navigation Items (first 4 items) */}
          {availableItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-3 px-2 transition-colors min-h-[60px]",
                  isActive
                    ? "text-green-800 bg-green-50"
                    : "text-gray-600 hover:text-green-800"
                )}
              >
                <Icon className={cn("w-4 h-4 mb-1 flex-shrink-0", isActive && "text-green-800")} />
                <span className="text-[9px] leading-tight text-center max-w-full truncate">
                  {item.label}
                </span>
              </Link>
            );
          })}
          
          {/* Logout Button (always last) */}
          <button
            onClick={logout}
            className="flex flex-col items-center justify-center py-3 px-2 transition-colors min-h-[60px] text-red-600 hover:text-red-800 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mb-1 flex-shrink-0" />
            <span className="text-[9px] leading-tight text-center max-w-full truncate">
              Logout
            </span>
          </button>
        </div>
      </div>
    </ClientOnly>
  );
}
