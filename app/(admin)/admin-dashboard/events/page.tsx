"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { eventsService } from "@/services/eventsService";
import DataTable from "@/components/DataTable";
import FormModal from "@/components/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, CalendarDays, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Event {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface EventFormData {
  name: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  status: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    description: "",
    imageUrl: "",
    startDate: "",
    endDate: "",
    status: "En cours",
  });

  const { toast } = useToast();

  const fetchEvents = useCallback(async () => {
    try {
      const data = await eventsService.getAll();
      setEvents(data);
    } catch (error: unknown) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les événements",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleAdd = () => {
    setEditingEvent(null);
    setFormData({
      name: "",
      description: "",
      imageUrl: "",
      startDate: "",
      endDate: "",
      status: "En cours",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      description: event.description,
      imageUrl: event.imageUrl || "",
      startDate: event.startDate ? event.startDate.split('T')[0] : "", // Format for date input
      endDate: event.endDate ? event.endDate.split('T')[0] : "",
      status: event.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (event: Event) => {
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate + 'T00:00:00.000Z').toISOString() : undefined,
        endDate: formData.endDate ? new Date(formData.endDate + 'T23:59:59.999Z').toISOString() : undefined,
      };

      if (editingEvent) {
        await eventsService.update(editingEvent.id, payload);
        toast({
          title: "Succès",
          description: "Événement mis à jour avec succès",
        });
      } else {
        await eventsService.create(payload);
        toast({
          title: "Succès", 
          description: "Événement créé avec succès",
        });
      }
      
      setIsModalOpen(false);
      fetchEvents();
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
    if (!eventToDelete) return;
    
    try {
      await eventsService.delete(eventToDelete.id);
      toast({
        title: "Succès",
        description: "Événement supprimé avec succès",
      });
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
      fetchEvents();
    } catch (error: unknown) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof EventFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const columns = [
    {
      key: 'name' as keyof Event,
      header: 'Nom',
      render: (value: unknown, item: Event) => (
        <div className="flex items-center space-x-3">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <div className="font-medium">{item.name}</div>
        </div>
      ),
    },
    {
      key: 'startDate' as keyof Event,
      header: 'Date de début',
      render: (value: unknown, item: Event) => (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>{formatDate(item.startDate)}</span>
        </div>
      ),
    },
    {
      key: 'endDate' as keyof Event,
      header: 'Date de fin',
      render: (value: unknown, item: Event) => (
        <div className="flex items-center space-x-2">
          <CalendarDays className="h-4 w-4 text-gray-500" />
          <span>{formatDate(item.endDate)}</span>
        </div>
      ),
    },
    {
      key: 'status' as keyof Event,
      header: 'Statut',
      render: (value: unknown, item: Event) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.status === 'En cours' 
            ? 'bg-green-100 text-green-800' 
            : item.status === 'Terminé'
            ? 'bg-gray-100 text-gray-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Calendar className="h-8 w-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Événements
          </h1>
          <p className="text-gray-600">
            Créez et gérez vos événements
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          {events.length} événement{events.length !== 1 ? 's' : ''} au total
        </div>
        <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
          <Calendar className="h-4 w-4 mr-2" />
          Ajouter un événement
        </Button>
      </div>

      <DataTable
        data={events}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
        emptyMessage="Aucun événement trouvé"
      />

      {/* Add/Edit Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? "Modifier l'événement" : "Ajouter un événement"}
        onSubmit={handleSubmit}
        isLoading={isSaving}
        maxWidth="2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="name">Nom de l'événement</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Nom de l'événement"
              required
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="imageUrl">Image (URL)</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange("imageUrl", e.target.value)}
              placeholder="https://exemple.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Date de début</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">Date de fin</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
              <option value="Annulé">Annulé</option>
            </select>
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Description de l'événement"
            />
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
            Êtes-vous sûr de vouloir supprimer l&apos;événement &quot;{eventToDelete?.name}&quot; ?
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
