"use client";

import { useState } from 'react';
import { cn } from "@/lib/utils";
import { 
  Home, 
  ShoppingCart, 
  Book, 
  MapPin,
  Phone,
  Bike,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ClientOnly from "../ClientOnly";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NavItems: NavItem[] = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/notre-carte", label: "Notre Carte", icon: ShoppingCart },
  { href: "/notre-histoire", label: "Notre Histoire", icon: Book },
  { href: "/nous-trouver", label: "Nous Trouver", icon: MapPin },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [isUberEatsMenuOpen, setIsUberEatsMenuOpen] = useState(false);

  return (
    <ClientOnly>
      {/* CTA Button and Submenu for Mobile */}
      <div className="md:hidden fixed bottom-24 right-4 z-50">
        {isSubMenuOpen && (
          <div
            className={`absolute right-0 bottom-full mb-2 w-56 bg-white rounded-md shadow-xl z-20 overflow-hidden ${
              isUberEatsMenuOpen ? 'min-h-[110px]' : 'min-h-[77px]'
            }`}
          >
            <div className={`transition-transform duration-300 ease-in-out ${isUberEatsMenuOpen ? '-translate-x-full' : 'translate-x-0'}`}>
              <div className="w-full flex-shrink-0" style={{ width: '100%' }}>
                <a href="tel:+33XXXXXXXXX" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-yellow-400">
                  <Phone className="w-4 h-4 mr-2" />
                  Par Téléphone
                </a>
                <button 
                  onClick={() => setIsUberEatsMenuOpen(true)}
                  className="w-full text-left flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-yellow-400"
                >
                  <div className="flex items-center">
                    <Bike className="w-4 h-4 mr-2" />
                    <span>Uber Eats</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute top-0 left-full w-full bg-white">
                <button 
                  onClick={() => setIsUberEatsMenuOpen(false)}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-yellow-400 font-bold"
                >
                  <ChevronRight className="w-4 h-4 mr-2 transform rotate-180" />
                  Retour
                </button>
                <a href="https://www.ubereats.com/fr/store/pizza-le-duc/ShfPBgd5WYG-0lAKLxIazQ" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-400">UBER EAT PODENSAC</a>
                <a href="https://www.ubereats.com/fr/store/pizza-le-duc-langon/knYx33kaXLSOSaJVs7XyRg" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-400">UBER EAT LANGON</a>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
          className="bg-red-600 text-white px-6 py-3 rounded-full font-bold uppercase shadow-lg hover:bg-red-700 transition duration-300 transform hover:scale-105 flex items-center"
        >
          Commander
        </button>
      </div>

      {/* Bottom Navigation Bar for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-pb">
        <div className="grid grid-cols-4">
          {NavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 text-center",
                  isActive ? "text-red-600" : "text-gray-600 hover:text-red-600"
                )}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs leading-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </ClientOnly>
  );
}
