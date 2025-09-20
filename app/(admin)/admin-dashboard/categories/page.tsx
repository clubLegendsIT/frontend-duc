"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { categoriesService } from "@/services/categoriesService";
import DataTable from "@/components/DataTable";
import FormModal from "@/components/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Folder, Hash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  displayOrder: number;
  parentId?: string;
  parent?: Category;
  itemCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface CategoryFormData {
  name: string;
  description: string;
  imageUrl: string;
  displayOrder: string;
  parentId: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    imageUrl: "",
    displayOrder: "0",
    parentId: "",
  });

  const { toast } = useToast();

  const fetchCategories = useCallback(async () => {
    try {
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (error: unknown) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      imageUrl: "",
      displayOrder: "0",
      parentId: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl || "",
      displayOrder: category.displayOrder.toString(),
      parentId: category.parentId || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        displayOrder: parseInt(formData.displayOrder),
        imageUrl: formData.imageUrl || undefined,
        parentId: formData.parentId || undefined,
      };
      
      if (editingCategory) {
        await categoriesService.update(editingCategory.id, payload);
        toast({
          title: "Succès",
          description: "Catégorie mise à jour avec succès",
        });
      } else {
        await categoriesService.create(payload);
        toast({
          title: "Succès",
          description: "Catégorie créée avec succès",
        });
      }
      
      setIsModalOpen(false);
      fetchCategories();
    } catch (error: unknown) {
      toast({
        title: "Erreur",
        description: (error as any)?.response?.data?.message || "Erreur lors de la sauvegarde",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      await categoriesService.delete(categoryToDelete.id);
      toast({
        title: "Succès",
        description: "Catégorie supprimée avec succès",
      });
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (error: unknown) {
      toast({
        title: "Erreur",
        description: (error as any)?.response?.data?.message || "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof CategoryFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const columns = [
    {
      key: 'name' as keyof Category,
      header: 'Nom',
      render: (value: unknown, item: Category) => (
        <div className="font-medium">{String(value)}</div>
      ),
    },
    {
      key: 'description' as keyof Category,
      header: 'Description',
      render: (value: unknown, item: Category) => (
        <div className="text-sm text-gray-600 max-w-xs truncate">
          {String(value) || "-"}
        </div>
      ),
    },
    {
      key: 'imageUrl' as keyof Category,
      header: 'Image',
      render: (value: unknown, item: Category) => (
        <div className="flex items-center space-x-2">
          {typeof value === "string" && value.length > 0 ? (
            <img src={value} alt={item.name} className="h-8 w-8 rounded-full" />
          ) : (
            <Folder className="h-4 w-4 text-gray-500" />
          )}
        </div>
      ),
    },
    {
      key: 'displayOrder' as keyof Category,
      header: 'Ordre d\'affichage',
      render: (value: unknown, item: Category) => (
        <div className="flex items-center space-x-2">
          <span>{typeof value === "number" ? value : 0}</span>
        </div>
      ),
    },
    {
      key: 'itemCount' as keyof Category,
      header: 'Articles',
      render: (value: unknown, item: Category) => (
        <div className="flex items-center space-x-2">
          <Hash className="h-4 w-4 text-gray-500" />
          <span>{typeof value === "number" ? value : 0} articles</span>
        </div>
      ),
    },
 
    {
      key: 'createdAt' as keyof Category,
      header: 'Créée le',
      render: (value: unknown, item: Category) => (
        typeof value === "string"
          ? new Date(value).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : ""
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Folder className="h-8 w-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Catégories
          </h1>
          <p className="text-gray-600">
            Organisez vos produits par catégories
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          {categories.length} catégorie{categories.length !== 1 ? 's' : ''} au total
        </div>
        <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
          <Folder className="h-4 w-4 mr-2" />
          Ajouter une catégorie
        </Button>
      </div>

      <DataTable
        data={categories}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
        emptyMessage="Aucune catégorie trouvée"
      />

      {/* Add/Edit Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? "Modifier la catégorie" : "Ajouter une catégorie"}
        onSubmit={handleSubmit}
        isLoading={isSaving}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de la catégorie</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Ex: Pizzas, Boissons, Desserts"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Description de la catégorie (optionnel)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image (URL)</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange("imageUrl", e.target.value)}
              placeholder="https://exemple.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayOrder">Ordre d'affichage</Label>
              <Input
                id="displayOrder"
                type="number"
                min="0"
                value={formData.displayOrder}
                onChange={(e) => handleInputChange("displayOrder", e.target.value)}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="parentId">Catégorie parente</Label>
              <select
                id="parentId"
                value={formData.parentId}
                onChange={(e) => handleInputChange("parentId", e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="">Aucune (catégorie principale)</option>
                {categories.filter(cat => cat.id !== editingCategory?.id).map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
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
              Êtes-vous sûr de vouloir supprimer la catégorie &quot;{categoryToDelete?.name}&quot; ?
            </p>
            {categoryToDelete?.itemCount && categoryToDelete.itemCount > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ Cette catégorie contient {categoryToDelete.itemCount} article(s). 
                  La suppression affectera ces articles.
                </p>
              </div>
            )}
            <p className="text-sm text-gray-600">
              Cette action est irréversible.
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
