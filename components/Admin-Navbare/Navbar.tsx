"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import ClientOnly from "../ClientOnly";

interface NavItem {
  href: string;
  label: string;
  roles: ("Admin" | "SuperAdmin")[];
}

const adminNavItems: NavItem[] = [
  { href: "/admin-dashboard", label: "Dashboard", roles: ["Admin"] },
   { href: "/superadmin-dashboard", label: "Dashboard", roles: ["SuperAdmin"] },
  { href: "/admin-dashboard/business", label: "Entreprise", roles: ["Admin", "SuperAdmin"] },
  { href: "/admin-dashboard/events", label: "Événements", roles: ["Admin", "SuperAdmin"] },
  { href: "/admin-dashboard/categories", label: "Catégories", roles: ["Admin", "SuperAdmin"] },
  { href: "/admin-dashboard/items", label: "Articles", roles: ["Admin", "SuperAdmin"] },
];

const superAdminNavItems: NavItem[] = [
  ...adminNavItems,
  { href: "/superadmin-dashboard/users", label: "Utilisateurs", roles: ["SuperAdmin"] },
];

export default function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();

  // Prevent hydration mismatch by not rendering until client-side
  if (isLoading || !user) return null;

  const navItems = user.role === "SuperAdmin" ? superAdminNavItems : adminNavItems;
  const availableItems = navItems.filter(item => item.roles.includes(user.role));

  return (
    <ClientOnly>
      <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-green-800">
                Pizza Le Duc
              </h1>
              <p className="text-xs text-gray-600">Administration</p>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-1">
              {availableItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-green-100 text-green-800"
                      : "text-gray-600 hover:text-green-800 hover:bg-green-50"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            {/* User Info Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-green-800" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-700">{user.email}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Direct Logout Button */}
            <Button 
              onClick={logout}
              variant="outline" 
              size="sm"
              className="hidden sm:flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
    </ClientOnly>
  );
}
