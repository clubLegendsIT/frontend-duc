"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { businessService } from "@/services/businessService";
import { Building2, Save, Phone, MapPin, Clock } from "lucide-react";

interface BusinessInfo {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string; // Keep for UI, but won't send to backend
  zipCode: string; // Keep for UI, but won't send to backend
  openingHours: string; // Will map to 'hours' for backend
  description: string;
}

export default function BusinessPage() {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    openingHours: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBusinessInfo();
  }, [fetchBusinessInfo]);

  const fetchBusinessInfo = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await businessService.getAll();
      if (data && data.length > 0) {
        const business = data[0];
        // Map backend data to frontend format
        setBusinessInfo({
          id: business.id,
          name: business.name || "",
          email: business.email || "",
          phone: business.phone || "",
          address: business.address || "",
          city: "", // Not provided by backend
          zipCode: "", // Not provided by backend
          openingHours: business.hours || "", // Map hours to openingHours
          description: business.description || "",
        });
      }
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err?.response?.status !== 404) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les informations de l&apos;entreprise",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Map frontend data to backend format
      const backendData = {
        name: businessInfo.name,
        email: businessInfo.email || undefined,
        phone: businessInfo.phone || undefined,
        address: businessInfo.address || undefined,
        description: businessInfo.description || undefined,
        hours: businessInfo.openingHours || undefined, // Map openingHours to hours
        // Note: city and zipCode are not sent to backend as they're not in the DTO
      };

      let updatedData;
      if (businessInfo.id) {
        updatedData = await businessService.update(businessInfo.id, backendData);
      } else {
        updatedData = await businessService.create(backendData);
        setBusinessInfo({ ...businessInfo, id: updatedData.id });
      }

      toast({
        title: "Succès",
        description: "Informations de l&apos;entreprise mises à jour avec succès",
      });
    } catch (error: unknown) {
      console.error('Business save error:', error);
      toast({
        title: "Erreur",
        description: (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Erreur lors de la sauvegarde",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof BusinessInfo, value: string) => {
    setBusinessInfo(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Building2 className="h-8 w-8 animate-pulse mx-auto mb-4 text-green-600" />
          <p>Chargement des informations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Building2 className="h-8 w-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Informations de l'Entreprise
          </h1>
          <p className="text-gray-600">
            Gérez les informations principales de votre entreprise
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Informations Générales</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l&apos;entreprise</Label>
                <Input
                  id="name"
                  value={businessInfo.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Pizza Le Duc"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={businessInfo.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Décrivez votre entreprise..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Contact</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={businessInfo.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="contact@pizzaleduc.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={businessInfo.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="05 56 XX XX XX"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Adresse</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={businessInfo.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="123 Rue de la Pizza"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={businessInfo.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Podensac"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Code Postal</Label>
                  <Input
                    id="zipCode"
                    value={businessInfo.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    placeholder="33720"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hours Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Horaires</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="openingHours">Horaires d&apos;ouverture</Label>
                <textarea
                  id="openingHours"
                  className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={businessInfo.openingHours}
                  onChange={(e) => handleInputChange("openingHours", e.target.value)}
                  placeholder="Lun-Ven: 11h30-14h00, 18h00-22h00&#10;Sam-Dim: 18h00-22h00"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </div>
      </form>
    </div>
  );
}
