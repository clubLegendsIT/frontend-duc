"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { itemsService } from "@/services/itemsService";
import { categoriesService } from "@/services/categoriesService";
import DataTable from "@/components/DataTable";
import FormModal from "@/components/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Euro, Folder, Plus, Trash2, Image, Upload } from "lucide-react";
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

interface ItemVariant {
  id?: string;
  variantName: string;
  price: number;
  sku?: string;
}

interface ItemImage {
  id?: string;
  imageUrl: string;
  isDefault: boolean;
  file?: File;
}

interface ItemOption {
  id?: string;
  optionName: string;
  optionValue: string;
  optionType?: string;
}

interface Item {
  id: string;
  name: string;
  description?: string;
  status: string;
  categoryId: string;
  category?: Category;
  variants: ItemVariant[];
  images: ItemImage[];
  options: ItemOption[];
  createdAt: string;
  updatedAt: string;
}

interface ItemFormData {
  name: string;
  description: string;
  categoryId: string;
  status: string;
  variants: ItemVariant[];
  images: ItemImage[];
  options: ItemOption[];
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
    categoryId: "",
    status: "Active",
    variants: [{ variantName: "Standard", price: 0, sku: "" }],
    images: [{ imageUrl: "", isDefault: true }],
    options: [],
  });

  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const [itemsData, categoriesData] = await Promise.all([
        itemsService.getAll(),
        categoriesService.getAll(),
      ]);
      setItems(itemsData);
      setCategories(categoriesData);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      categoryId: "",
      status: "Active",
      variants: [{ variantName: "Standard", price: 0, sku: "" }],
      images: [{ imageUrl: "", isDefault: true }],
      options: [],
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      categoryId: item.categoryId,
      status: item.status,
      variants: item.variants.length > 0 ? item.variants : [{ variantName: "Standard", price: 0, sku: "" }],
      images: item.images.length > 0 ? item.images : [{ imageUrl: "", isDefault: true }],
      options: item.options || [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item: Item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      throw new Error('Failed to upload file');
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const processedImages = await Promise.all(
        formData.images.map(async (image) => {
          if (image.file) {
            const uploadedUrl = await uploadFile(image.file);
            return { ...image, imageUrl: uploadedUrl, file: undefined };
          }
          return image;
        })
      );

      const payload = {
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId,
        status: formData.status,
        variants: formData.variants
          .filter(v => v.variantName && v.price > 0)
          .map(({ id, ...variant }) => variant),
        images: processedImages
          .filter(img => img.imageUrl)
          .map(({ id, file, ...image }) => image),
        options: formData.options
          .filter(opt => opt.optionName && opt.optionValue)
          .map(({ id, ...option }) => option),
      };

      if (editingItem) {
        await itemsService.update(editingItem.id, payload);
        toast({
          title: "Succès",
          description: "Article mis à jour avec succès",
        });
      } else {
        // Calculate main price from variants or set to 0
        const mainPrice =
          payload.variants && payload.variants.length > 0
            ? Math.min(...payload.variants.map(v => v.price))
            : 0;

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

  const handleInputChange = (field: keyof ItemFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { variantName: "", price: 0, sku: "" }]
    }));
  };

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const updateVariant = (index: number, field: keyof ItemVariant, value: any) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { imageUrl: "", isDefault: false }]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const updateImage = (index: number, field: keyof ItemImage, value: any) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((image, i) => 
        i === index ? { ...image, [field]: value } : image
      )
    }));
  };

  const handleFileUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      updateImage(index, 'imageUrl', e.target?.result as string);
      updateImage(index, 'file', file);
    };
    reader.readAsDataURL(file);
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { optionName: "", optionValue: "", optionType: "addon" }]
    }));
  };

  const removeOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const updateOption = (index: number, field: keyof ItemOption, value: any) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((option, i) => 
        i === index ? { ...option, [field]: value } : option
      )
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const getMainPrice = (item: Item) => {
    if (item.variants && item.variants.length > 0) {
      const prices = item.variants.map(v => v.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      return minPrice === maxPrice ? formatPrice(minPrice) : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
    }
    return "N/A";
  };

  const getMainImage = (item: Item) => {
    const defaultImage = item.images?.find(img => img.isDefault);
    return defaultImage?.imageUrl || item.images?.[0]?.imageUrl;
  };

  const columns = [
    {
      key: 'name' as keyof Item,
      header: 'Nom',
      render: (value: unknown, item: Item) => {
        const name = value as string;
        return (
          <div className="flex items-center space-x-3">
            {getMainImage(item) ? (
              <img 
                src={getMainImage(item)} 
                alt={name}
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-gray-400" />
              </div>
            )}
            <div className="font-medium">{name}</div>
          </div>
        );
      },
    },
    {
      key: 'category' as keyof Item,
      header: 'Catégorie',
      render: (value: unknown) => {
        const category = value as Category | undefined;
        return (
          <div className="flex items-center space-x-2">
            <Folder className="h-4 w-4 text-gray-500" />
            <span>{category?.name || 'Non catégorisé'}</span>
          </div>
        );
      },
    },
    {
      key: 'variants' as keyof Item,
      header: 'Détails',
      render: (value: unknown, item: Item) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Euro className="h-4 w-4 text-gray-500" />
            <span className="font-medium text-sm">{getMainPrice(item)}</span>
          </div>
          <div className="text-xs text-gray-500">
            {item.variants?.length || 0} variante{(item.variants?.length || 0) !== 1 ? 's' : ''} • 
            {item.images?.length || 0} image{(item.images?.length || 0) !== 1 ? 's' : ''} • 
            {item.options?.length || 0} option{(item.options?.length || 0) !== 1 ? 's' : ''}
          </div>
        </div>
      ),
    },
    {
      key: 'status' as keyof Item,
      header: 'Statut',
      render: (value: unknown) => {
        const status = value as string;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === 'Active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {status === 'Active' ? 'Actif' : 'Inactif'}
          </span>
        );
      },
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
            Gérez votre catalogue de produits avec variantes et options
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
        <div className="space-y-6">
          {/* Basic Information */}
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
              <Label htmlFor="status">Statut</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="Active">Actif</option>
                <option value="Inactive">Inactif</option>
                <option value="Discontinued">Discontinué</option>
              </select>
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
          </div>

          {/* Variants Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Variantes</h3>
              <Button type="button" onClick={addVariant} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une variante
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.variants.map((variant, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border rounded-lg">
                  <div className="space-y-1">
                    <Label>Nom de la variante</Label>
                    <Input
                      value={variant.variantName}
                      onChange={(e) => updateVariant(index, "variantName", e.target.value)}
                      placeholder="Ex: Petite, Grande"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Prix (€)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={variant.price}
                      onChange={(e) => updateVariant(index, "price", parseFloat(e.target.value) || 0)}
                      placeholder="12.50"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>SKU (optionnel)</Label>
                    <Input
                      value={variant.sku || ""}
                      onChange={(e) => updateVariant(index, "sku", e.target.value)}
                      placeholder="ITEM-001-S"
                    />
                  </div>
                  <div className="flex items-end">
                    {formData.variants.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeVariant(index)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Images</h3>
              <Button type="button" onClick={addImage} size="sm" variant="outline">
                <Image className="h-4 w-4 mr-2" />
                Ajouter une image
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.images.map((image, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Image</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="url"
                        value={image.imageUrl}
                        onChange={(e) => updateImage(index, "imageUrl", e.target.value)}
                        placeholder="https://exemple.com/image.jpg"
                        className="flex-1"
                      />
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(index, file);
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Button type="button" size="sm" variant="outline">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {image.imageUrl && (
                      <img src={image.imageUrl} alt="Preview" className="w-16 h-16 object-cover rounded" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={image.isDefault}
                        onChange={(e) => updateImage(index, "isDefault", e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label>Image par défaut</Label>
                    </div>
                    {formData.images.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeImage(index)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Options Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Options & Compléments</h3>
              <Button type="button" onClick={addOption} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une option
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border rounded-lg">
                  <div className="space-y-1">
                    <Label>Nom de l'option</Label>
                    <Input
                      value={option.optionName}
                      onChange={(e) => updateOption(index, "optionName", e.target.value)}
                      placeholder="Ex: Fromage supplémentaire"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Valeur</Label>
                    <Input
                      value={option.optionValue}
                      onChange={(e) => updateOption(index, "optionValue", e.target.value)}
                      placeholder="Ex: +2€"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Type</Label>
                    <select
                      value={option.optionType || "addon"}
                      onChange={(e) => updateOption(index, "optionType", e.target.value)}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                    >
                      <option value="addon">Complément</option>
                      <option value="modifier">Modificateur</option>
                      <option value="choice">Choix</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      onClick={() => removeOption(index)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
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
          <p>
            Êtes-vous sûr de vouloir supprimer l'article "{itemToDelete?.name}" ?
            Cette action supprimera également toutes ses variantes, images et options.
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
