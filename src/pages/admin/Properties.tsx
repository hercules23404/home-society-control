
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  PlusCircle,
  Home,
  User,
  Building,
  BedDouble,
  Bath,
  MapPin,
  Check,
  X,
  Filter,
  Edit,
  Loader2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Database } from "@/integrations/supabase/types";

type PropertyStatus = Database["public"]["Enums"]["property_status_type"];
type PropertyType = Database["public"]["Enums"]["property_type"];

type Property = {
  id: string;
  property_type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  rent_amount: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  description?: string;
  status: PropertyStatus;
  amenities?: string[];
  photos?: string[];
  society_id: string;
  created_at: string;
};

const PropertiesPage = () => {
  const { society } = useAdminAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  const [propertyType, setPropertyType] = useState<PropertyType>("2BHK");
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [area, setArea] = useState(1200);
  const [rent, setRent] = useState(12000);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<PropertyStatus>('vacant');
  const [amenitiesInput, setAmenitiesInput] = useState("");
  const [amenities, setAmenities] = useState<string[]>(["Balcony", "Reserved Parking"]);

  const queryClient = useQueryClient();

  const { data: properties = [], isLoading, error } = useQuery({
    queryKey: ['properties', society?.id],
    queryFn: async () => {
      if (!society?.id) return [];
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('society_id', society.id);
        
      if (error) {
        toast.error('Failed to fetch properties');
        throw error;
      }
      
      return data as Property[];
    },
    enabled: !!society?.id,
  });

  const createPropertyMutation = useMutation({
    mutationFn: async (newProperty: Omit<Property, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from('properties')
        .insert(newProperty)
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Property created successfully!');
      setIsCreateDialogOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['properties', society?.id] });
    },
    onError: (error) => {
      toast.error('Failed to create property: ' + error.message);
    }
  });

  const updatePropertyMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<Property> }) => {
      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Property updated successfully!');
      setIsEditDialogOpen(false);
      setEditingProperty(null);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['properties', society?.id] });
    },
    onError: (error) => {
      toast.error('Failed to update property: ' + error.message);
    }
  });

  const deletePropertyMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Property deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['properties', society?.id] });
    },
    onError: (error) => {
      toast.error('Failed to delete property: ' + error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address || !city || !state || !zipCode) {
      toast.error('Please fill all required fields');
      return;
    }
    
    if (!society?.id) {
      toast.error('Society not found');
      return;
    }
    
    const newProperty = {
      property_type: propertyType,
      bedrooms,
      bathrooms,
      area_sqft: area,
      rent_amount: rent,
      address,
      city,
      state,
      zip_code: zipCode,
      description,
      status,
      amenities,
      photos: ['https://placehold.co/600x400?text=Property+Image'],
      society_id: society.id,
    };
    
    createPropertyMutation.mutate(newProperty);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingProperty) return;
    
    if (!address || !city || !state || !zipCode) {
      toast.error('Please fill all required fields');
      return;
    }
    
    updatePropertyMutation.mutate({
      id: editingProperty.id,
      updates: {
        property_type: propertyType,
        bedrooms,
        bathrooms,
        area_sqft: area,
        rent_amount: rent,
        address,
        city,
        state,
        zip_code: zipCode,
        description,
        status,
        amenities,
      }
    });
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setPropertyType(property.property_type);
    setBedrooms(property.bedrooms);
    setBathrooms(property.bathrooms);
    setArea(property.area_sqft);
    setRent(property.rent_amount);
    setAddress(property.address);
    setCity(property.city);
    setState(property.state);
    setZipCode(property.zip_code);
    setDescription(property.description || "");
    setStatus(property.status);
    setAmenities(property.amenities || []);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      deletePropertyMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setPropertyType('2BHK');
    setBedrooms(2);
    setBathrooms(2);
    setArea(1200);
    setRent(12000);
    setAddress("");
    setCity("");
    setState("");
    setZipCode("");
    setDescription("");
    setStatus('vacant');
    setAmenitiesInput("");
    setAmenities(["Balcony", "Reserved Parking"]);
  };

  const handleAddAmenity = () => {
    if (!amenitiesInput.trim()) return;
    setAmenities([...amenities, amenitiesInput.trim()]);
    setAmenitiesInput("");
  };

  const handleRemoveAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  const filteredProperties = properties
    .filter(property => {
      if (currentTab === "all") return true;
      else if (currentTab === "occupied") return property.status === 'occupied';
      else if (currentTab === "vacant") return property.status === 'vacant';
      else if (currentTab === "under_maintenance") return property.status === 'under_maintenance';
      return true;
    })
    .filter(property => {
      const searchText = searchTerm.toLowerCase();
      return (
        property.address.toLowerCase().includes(searchText) ||
        property.property_type.toLowerCase().includes(searchText) ||
        property.city.toLowerCase().includes(searchText) ||
        property.state.toLowerCase().includes(searchText)
      );
    });

  const getOccupancyBadge = (status: PropertyStatus) => {
    switch (status) {
      case 'occupied':
        return <Badge className="bg-green-600">Occupied</Badge>;
      case 'under_maintenance':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Under Maintenance</Badge>;
      default:
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Vacant</Badge>;
    }
  };

  const totalProperties = properties.length;
  const occupiedProperties = properties.filter(p => p.status === 'occupied').length;
  const vacantProperties = properties.filter(p => p.status === 'vacant').length;

  if (error) {
    return (
      <DashboardLayout role="admin">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-red-500">Error loading properties</h2>
          <p>Please try refreshing the page</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-rental-text">Properties</h1>
        <p className="text-rental-text-light">
          Manage all properties in your society
        </p>
      </div>

      <Card className="shadow-sm mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Property Overview</CardTitle>
          <CardDescription>
            Quick summary of your properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-md">
              <Building className="h-5 w-5" />
              <div>
                <div className="text-sm font-medium">Total Properties</div>
                <div className="text-2xl font-bold">{totalProperties}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-md">
              <Check className="h-5 w-5" />
              <div>
                <div className="text-sm font-medium">Occupied</div>
                <div className="text-2xl font-bold">{occupiedProperties}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-md">
              <X className="h-5 w-5" />
              <div>
                <div className="text-sm font-medium">Vacant</div>
                <div className="text-2xl font-bold">{vacantProperties}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-6">
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList>
            <TabsTrigger value="all">All Properties</TabsTrigger>
            <TabsTrigger value="occupied">Occupied</TabsTrigger>
            <TabsTrigger value="vacant">Vacant</TabsTrigger>
            <TabsTrigger value="under_maintenance">Under Maintenance</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-rental-primary hover:bg-rental-secondary">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Property</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new property to your society.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 py-4">
                <h3 className="text-lg font-medium">Property Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="property-type">Property Type</Label>
                    <Select
                      value={propertyType}
                      onValueChange={(value) => setPropertyType(value as PropertyType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1BHK">1 BHK</SelectItem>
                        <SelectItem value="2BHK">2 BHK</SelectItem>
                        <SelectItem value="3BHK">3 BHK</SelectItem>
                        <SelectItem value="4BHK">4 BHK</SelectItem>
                        <SelectItem value="studio">Studio</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={status}
                      onValueChange={(value) => setStatus(value as PropertyStatus)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vacant">Vacant</SelectItem>
                        <SelectItem value="occupied">Occupied</SelectItem>
                        <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      type="number"
                      id="bedrooms"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(parseInt(e.target.value))}
                      min={0}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      type="number"
                      id="bathrooms"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(parseInt(e.target.value))}
                      min={0}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="area">Area (sq ft)</Label>
                    <Input
                      type="number"
                      id="area"
                      value={area}
                      onChange={(e) => setArea(parseInt(e.target.value))}
                      min={0}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="rent">Monthly Rent (₹)</Label>
                  <Input
                    type="number"
                    id="rent"
                    value={rent}
                    onChange={(e) => setRent(parseInt(e.target.value))}
                    min={0}
                  />
                </div>

                <h3 className="text-lg font-medium mt-2">Property Address</h3>
                <div className="grid gap-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <h3 className="text-lg font-medium mt-2">Amenities</h3>
                <div className="grid gap-2">
                  <div className="flex">
                    <Input
                      value={amenitiesInput}
                      onChange={(e) => setAmenitiesInput(e.target.value)}
                      placeholder="Add amenity (e.g. Swimming Pool)"
                      className="mr-2"
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddAmenity}
                      variant="outline"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {amenities.map((amenity, index) => (
                      <Badge 
                        key={index} 
                        variant="outline"
                        className="flex items-center gap-1 px-3 py-1"
                      >
                        {amenity}
                        <button 
                          type="button"
                          onClick={() => handleRemoveAmenity(index)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-rental-primary hover:bg-rental-secondary"
                  disabled={createPropertyMutation.isPending}
                >
                  {createPropertyMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Add Property'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Property</DialogTitle>
              <DialogDescription>
                Update the property information below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid gap-4 py-4">
                <h3 className="text-lg font-medium">Property Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-property-type">Property Type</Label>
                    <Select
                      value={propertyType}
                      onValueChange={(value) => setPropertyType(value as PropertyType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1BHK">1 BHK</SelectItem>
                        <SelectItem value="2BHK">2 BHK</SelectItem>
                        <SelectItem value="3BHK">3 BHK</SelectItem>
                        <SelectItem value="4BHK">4 BHK</SelectItem>
                        <SelectItem value="studio">Studio</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={status}
                      onValueChange={(value) => setStatus(value as PropertyStatus)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vacant">Vacant</SelectItem>
                        <SelectItem value="occupied">Occupied</SelectItem>
                        <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-bedrooms">Bedrooms</Label>
                    <Input
                      type="number"
                      id="edit-bedrooms"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(parseInt(e.target.value))}
                      min={0}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-bathrooms">Bathrooms</Label>
                    <Input
                      type="number"
                      id="edit-bathrooms"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(parseInt(e.target.value))}
                      min={0}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-area">Area (sq ft)</Label>
                    <Input
                      type="number"
                      id="edit-area"
                      value={area}
                      onChange={(e) => setArea(parseInt(e.target.value))}
                      min={0}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-rent">Monthly Rent (₹)</Label>
                  <Input
                    type="number"
                    id="edit-rent"
                    value={rent}
                    onChange={(e) => setRent(parseInt(e.target.value))}
                    min={0}
                  />
                </div>

                <h3 className="text-lg font-medium mt-2">Property Address</h3>
                <div className="grid gap-2">
                  <Label htmlFor="edit-address">Street Address</Label>
                  <Input
                    id="edit-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-city">City</Label>
                    <Input
                      id="edit-city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-state">State</Label>
                    <Input
                      id="edit-state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-zipCode">ZIP Code</Label>
                    <Input
                      id="edit-zipCode"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <h3 className="text-lg font-medium mt-2">Amenities</h3>
                <div className="grid gap-2">
                  <div className="flex">
                    <Input
                      value={amenitiesInput}
                      onChange={(e) => setAmenitiesInput(e.target.value)}
                      placeholder="Add amenity (e.g. Swimming Pool)"
                      className="mr-2"
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddAmenity}
                      variant="outline"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {amenities.map((amenity, index) => (
                      <Badge 
                        key={index} 
                        variant="outline"
                        className="flex items-center gap-1 px-3 py-1"
                      >
                        {amenity}
                        <button 
                          type="button"
                          onClick={() => handleRemoveAmenity(index)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-rental-primary hover:bg-rental-secondary"
                  disabled={updatePropertyMutation.isPending}
                >
                  {updatePropertyMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Property'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search properties..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-rental-primary" />
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-12">
          <Home className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium">No properties found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm ? 'Try a different search term' : 'Get started by adding a new property'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-rental-text">
                      {property.property_type} - {property.address}
                    </CardTitle>
                    <CardDescription className="text-rental-text-light">
                      {property.city}, {property.state} - {property.zip_code}
                    </CardDescription>
                  </div>
                  {getOccupancyBadge(property.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {property.photos && property.photos.length > 0 && (
                  <img
                    src={property.photos[0]}
                    alt={property.address}
                    className="w-full h-40 object-cover rounded-md"
                  />
                )}
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <BedDouble className="h-4 w-4 mr-1 text-rental-text-light" />
                    <span>{property.bedrooms} Beds</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1 text-rental-text-light" />
                    <span>{property.bathrooms} Baths</span>
                  </div>
                  <div>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      ₹{property.rent_amount.toLocaleString()}
                    </Badge>
                  </div>
                </div>
                
                {property.amenities && property.amenities.length > 0 && (
                  <div>
                    <p className="text-sm text-rental-text-light mb-1">Amenities:</p>
                    <div className="flex flex-wrap gap-1">
                      {property.amenities.map((amenity, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{amenity}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEdit(property)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(property.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default PropertiesPage;
