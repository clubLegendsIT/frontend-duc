"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Calendar, Folder, Package } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Entreprise",
      description: "Gestion des informations de l'entreprise",
      icon: Building2,
      href: "/admin-dashboard/business",
      color: "bg-blue-500",
    },
    {
      title: "Événements",
      description: "Gestion des événements",
      icon: Calendar,
      href: "/admin-dashboard/events",
      color: "bg-green-500",
    },
    {
      title: "Catégories",
      description: "Gestion des catégories de produits",
      icon: Folder,
      href: "/admin-dashboard/categories",
      color: "bg-purple-500",
    },
    {
      title: "Articles",
      description: "Gestion des articles/produits",
      icon: Package,
      href: "/admin-dashboard/items",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Tableau de bord Admin
        </h1>
        <p className="text-gray-600 mt-2">
          Bienvenue, {user?.name}. Gérez votre contenu ici.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => window.location.href = stat.href}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.color} text-white group-hover:scale-110 transition-transform`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Connexion réussie</span>
              <span className="text-gray-400 ml-auto">Maintenant</span>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Dashboard chargé</span>
              <span className="text-gray-400 ml-auto">Il y a quelques secondes</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
