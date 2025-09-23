"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, Phone, Bike } from 'lucide-react';

const Navbar = () => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [isUberEatsOpen, setIsUberEatsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsSubMenuOpen(false);
        setIsUberEatsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleUberEatsClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the main menu from closing
    setIsUberEatsOpen(!isUberEatsOpen);
  }

  return (
    <nav className="bg-white shadow-md border-t border-gray-200 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex items-center justify-start space-x-8">
            <Link href="/" className="text-gray-700 hover:text-red-600 transition duration-300 font-medium">Accueil</Link>
            <Link href="/notre-carte" className="text-gray-700 hover:text-red-600 transition duration-300 font-medium">Notre Carte</Link>
            <Link href="/notre-histoire" className="text-gray-700 hover:text-red-600 transition duration-300 font-medium">Notre Histoire</Link>
            <Link href="/nous-trouver" className="text-gray-700 hover:text-red-600 transition duration-300 font-medium">Nous Trouver</Link>
          </div>
          <div className="absolute right-8">
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
                className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-bold uppercase shadow-lg hover:bg-red-700 transition duration-300 transform hover:scale-105"
              >
                Commander une pizza
              </button>
              {isSubMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl py-2 z-20">
                  <a href="tel:+33XXXXXXXXX" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-yellow-400">
                    <Phone className="w-4 h-4 mr-2" />
                    Commander par Téléphone
                  </a>
                  <div className="relative">
                    <button onClick={handleUberEatsClick} className="w-full text-left flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-yellow-400">
                      <div className="flex items-center">
                        <Bike className="w-4 h-4 mr-2" />
                        <span>Livraison avec Uber Eats</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${isUberEatsOpen ? 'rotate-90' : ''}`} />
                    </button>
                    {isUberEatsOpen && (
                      <div className="absolute right-full top-0 mt-0 w-56 bg-white rounded-md shadow-xl py-2 z-30">
                        <a href="https://www.ubereats.com/fr/store/pizza-le-duc/ShfPBgd5WYG-0lAKLxIazQ" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-400">UBER EAT PODENSAC</a>
                        <a href="https://www.ubereats.com/fr/store/pizza-le-duc-langon/knYx33kaXLSOSaJVs7XyRg" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-400">UBER EAT LANGON</a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;