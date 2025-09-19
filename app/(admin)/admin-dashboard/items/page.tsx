"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { itemsService } from "@/services/itemsService";
import { categoriesService } from "@/services/categoriesService";
import DataTable from "@/components/DataTable";
import FormModal from "@/components/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Euro, Folder } from "lucide-react";
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
}

interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  category?: Category;
  isAvailable: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface ItemFormData {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  isAvailable: boolean;
  imageUrl: string;
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [formData, setFormData] = useState<ItemFormData>({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    isAvailable: true,
    imageUrl: "",
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsData, categoriesData] = await Promise.all([
        itemsService.getAll(),
        categoriesService.getAll(),
      ]);
      setItems(itemsData);
      setCategories(categoriesData.filter((cat: Category & { isActive: boolean }) => cat.isActive));
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      isAvailable: true,
      imageUrl: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      categoryId: item.categoryId,
      isAvailable: item.isAvailable,
      imageUrl: item.imageUrl || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item: Item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (editingItem) {
        await itemsService.update(editingItem.id, payload);
        toast({
          title: "Succès",
          description: "Article mis à jour avec succès",
        });
      } else {
        await itemsService.create(payload);
        toast({
          title: "Succès",
          description: "Article créé avec succès",
        });
      }
      
      setIsModalOpen(false);
      fetchData();
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
    if (!itemToDelete) return;
    
    try {
      await itemsService.delete(itemToDelete.id);
      toast({
        title: "Succès",
        description: "Article supprimé avec succès",
      });
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      fetchData();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof ItemFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const columns = [
    {
      key: 'name' as keyof Item,
      header: 'Nom',
      render: (value: string, item: Item) => (
        <div className="flex items-center space-x-3">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={value}
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <div className="font-medium">{value}</div>
        </div>
      ),
    },
    {
      key: 'category' as keyof Item,
      header: 'Catégorie',
      render: (value: Category | undefined) => (
        <div className="flex items-center space-x-2">
          <Folder className="h-4 w-4 text-gray-500" />
          <span>{value?.name || 'Non catégorisé'}</span>
        </div>
      ),
    },
    {
      key: 'price' as keyof Item,
      header: 'Prix',
      render: (value: number) => (
        <div className="flex items-center space-x-2">
          <Euro className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{formatPrice(value)}</span>
        </div>
      ),
    },
    {
      key: 'description' as keyof Item,
      header: 'Description',
      render: (value: string) => (
        <div className="text-sm text-gray-600 max-w-xs truncate">
          {value || "-"}
        </div>
      ),
    },
    {
      key: 'isAvailable' as keyof Item,
      header: 'Disponibilité',
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Disponible' : 'Indisponible'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Package className="h-8 w-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Articles
          </h1>
          <p className="text-gray-600">
            Gérez votre catalogue de produits
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          {items.length} article{items.length !== 1 ? 's' : ''} au total
        </div>
        <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
          <Package className="h-4 w-4 mr-2" />
          Ajouter un article
        </Button>
      </div>

      <DataTable
        data={items}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
        emptyMessage="Aucun article trouvé"
      />

      {/* Add/Edit Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Modifier l'article" : "Ajouter un article"}
        onSubmit={handleSubmit}
        isLoading={isSaving}
        maxWidth="2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de l'article</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Ex: Pizza Margherita"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Prix (€)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="12.50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Catégorie</Label>
            <select
              id="categoryId"
              value={formData.categoryId}
              onChange={(e) => handleInputChange("categoryId", e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              required
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL de l'image (optionnel)</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange("imageUrl", e.target.value)}
              placeholder="https://exemple.com/image.jpg"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Description de l'article"
            />
          </div>

          <div className="md:col-span-2 flex items-center space-x-2">
            <input
              type="checkbox"
              id="isAvailable"
              checked={formData.isAvailable}
              onChange={(e) => handleInputChange("isAvailable", e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="isAvailable">Article disponible</Label>
          </div>
        </div>
      </FormModal>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p>
            Êtes-vous sûr de vouloir supprimer l'article "{itemToDelete?.name}" ?
            Cette action est irréversible.
          </p>
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
