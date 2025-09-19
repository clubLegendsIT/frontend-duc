"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { usersService } from "@/services/usersService";
import DataTable from "@/components/DataTable";
import FormModal from "@/components/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Mail, Shield, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  email: string;
  role: "Admin" | "SuperAdmin";
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserFormData {
  email: string;
  password: string;
  role: "Admin" | "SuperAdmin";
  isActive: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    password: "",
    role: "Admin",
    isActive: true,
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await usersService.getAll();
      setUsers(data);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      email: "",
      password: "",
      role: "Admin",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: "", // Password should be empty for editing
      role: user.role,
      isActive: user.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      if (editingUser) {
        const payload = { 
          email: formData.email, 
          role: formData.role, 
          isActive: formData.isActive,
          ...(formData.password && { password: formData.password })
        };
        await usersService.update(editingUser.id, payload);
        toast({
          title: "Succès",
          description: "Utilisateur mis à jour avec succès",
        });
      } else {
        await usersService.create(formData);
        toast({
          title: "Succès",
          description: "Utilisateur créé avec succès",
        });
      }
      
      setIsModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Erreur lors de la sauvegarde",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      await usersService.delete(userToDelete.id);
      toast({
        title: "Succès",
        description: "Utilisateur supprimé avec succès",
      });
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof UserFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleBadgeColor = (role: string) => {
    return role === 'SuperAdmin' 
      ? 'bg-red-100 text-red-800' 
      : 'bg-blue-100 text-blue-800';
  };

  const columns = [
    {
      key: 'email' as keyof User,
      header: 'Email',
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'role' as keyof User,
      header: 'Rôle',
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4 text-gray-500" />
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(value)}`}>
            {value}
          </span>
        </div>
      ),
    },
    {
      key: 'isActive' as keyof User,
      header: 'Statut',
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? 'Actif' : 'Inactif'}
        </span>
      ),
    },
    {
      key: 'lastLogin' as keyof User,
      header: 'Dernière connexion',
      render: (value: string | undefined) => (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm">
            {value ? formatDate(value) : 'Jamais'}
          </span>
        </div>
      ),
    },
    {
      key: 'createdAt' as keyof User,
      header: 'Créé le',
      render: (value: string) => (
        <span className="text-sm text-gray-600">
          {formatDate(value)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Users className="h-8 w-8 text-red-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Utilisateurs
          </h1>
          <p className="text-gray-600">
            Gérez les comptes utilisateur du système
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-yellow-600" />
          <p className="text-sm text-yellow-800 font-medium">
            Zone d'administration système
          </p>
        </div>
        <p className="text-sm text-yellow-700 mt-1">
          Seuls les SuperAdmins peuvent gérer les utilisateurs. Soyez prudent lors de la modification des rôles.
        </p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          {users.length} utilisateur{users.length !== 1 ? 's' : ''} au total
        </div>
        <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
          <Users className="h-4 w-4 mr-2" />
          Ajouter un utilisateur
        </Button>
      </div>

      <DataTable
        data={users}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
        emptyMessage="Aucun utilisateur trouvé"
      />

      {/* Add/Edit Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
        onSubmit={handleSubmit}
        isLoading={isSaving}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Adresse email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="utilisateur@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {editingUser ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder={editingUser ? "Laisser vide pour ne pas changer" : "Mot de passe sécurisé"}
              required={!editingUser}
            />
            {!editingUser && (
              <p className="text-xs text-gray-500">
                Minimum 8 caractères recommandés
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => handleInputChange("role", e.target.value as "Admin" | "SuperAdmin")}
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              required
            >
              <option value="Admin">Admin</option>
              <option value="SuperAdmin">SuperAdmin</option>
            </select>
            <div className="text-xs text-gray-500 space-y-1">
              <p><strong>Admin :</strong> Peut gérer le contenu (articles, catégories, événements, entreprise)</p>
              <p><strong>SuperAdmin :</strong> Accès complet + gestion des utilisateurs</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleInputChange("isActive", e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="isActive">Compte actif</Label>
          </div>
        </div>
      </FormModal>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Êtes-vous sûr de vouloir supprimer l'utilisateur "{userToDelete?.email}" ?
            </p>
            {userToDelete?.role === 'SuperAdmin' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  ⚠️ Attention ! Vous supprimez un compte SuperAdmin. 
                  Assurez-vous qu'il reste au moins un autre SuperAdmin dans le système.
                </p>
              </div>
            )}
            <p className="text-sm text-gray-600">
              Cette action est irréversible et supprimera définitivement l'accès de cet utilisateur.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
