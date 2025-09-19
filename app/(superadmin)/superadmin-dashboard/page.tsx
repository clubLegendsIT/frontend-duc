"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Calendar, Folder, Package, Users, Shield } from "lucide-react";

export default function SuperAdminDashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Utilisateurs",
      description: "Gestion des utilisateurs du système",
      icon: Users,
      href: "/superadmin-dashboard/users",
      color: "bg-red-500",
    },
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
      <div className="flex items-center space-x-3">
        <Shield className="h-8 w-8 text-red-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Tableau de bord SuperAdmin
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenue, {user?.email}. Contrôle total du système.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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

      {/* System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Connexion SuperAdmin</span>
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

        <Card>
          <CardHeader>
            <CardTitle>Statistiques système</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Utilisateurs actifs</span>
                <span className="font-semibold">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Rôles disponibles</span>
                <span className="font-semibold">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Dernière mise à jour</span>
                <span className="text-sm text-gray-400">Aujourd'hui</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
