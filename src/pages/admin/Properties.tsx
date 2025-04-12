
import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
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
} from "lucide-react";

// Mock data for properties
const mockProperties = [
  {
    id: "1",
    flatNumber: "A-101",
    type: "2BHK",
    size: "1200 sq ft",
    tenant: "Amit Kumar",
    occupied: true,
    bedrooms: 2,
    bathrooms: 2,
    furnished: true,
    amenities: ["Balcony", "Reserved Parking", "Piped Gas"],
  },
  {
    id: "2",
    flatNumber: "B-205",
    type: "3BHK",
    size: "1500 sq ft",
    tenant: "Priya Singh",
    occupied: true,
    bedrooms: 3,
    bathrooms: 2,
    furnished: true,
    amenities: ["Balcony", "Reserved Parking", "Power Backup"],
  },
  {
    id: "3",
    flatNumber: "C-304",
    type: "2BHK",
    size: "1100 sq ft",
    tenant: "Rahul Sharma",
    occupied: true,
    bedrooms: 2,
    bathrooms: 2,
    furnished: false,
    amenities: ["Balcony", "Reserved Parking"],
  },
  {
    id: "4",
    flatNumber: "D-402",
    type: "1BHK",
    size: "800 sq ft",
    tenant: null,
    occupied: false,
    bedrooms: 1,
    bathrooms: 1,
    furnished: true,
    amenities: ["Reserved Parking", "Power Backup"],
  },
  {
    id: "5",
    flatNumber: "E-501",
    type: "3BHK",
    size: "1600 sq ft",
    tenant: "Vikram Malhotra",
    occupied: true,
    bedrooms: 3,
    bathrooms: 3,
    furnished: true,
    amenities: ["Balcony", "Reserved Parking", "Power Backup", "Gym Access"],
  },
  {
    id: "6",
    flatNumber: "F-602",
    type: "2BHK",
    size: "1250 sq ft",
    tenant: null,
    occupied: false,
    bedrooms: 2,
    bathrooms: 2,
    furnished: false,
    amenities: ["Balcony", "Reserved Parking"],
  },
];

const PropertiesPage = () => {
  const [properties] = useState(mockProperties);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");

  const filteredProperties = properties
    .filter(property => {
      if (currentTab === "all") return true;
      else if (currentTab === "occupied") return property.occupied;
      else if (currentTab === "vacant") return !property.occupied;
      return true;
    })
    .filter(property => 
      property.flatNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
      property.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (property.tenant && property.tenant.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const getOccupancyBadge = (occupied: boolean) => {
    return occupied ? 
      <Badge className="bg-green-600">Occupied</Badge> : 
      <Badge variant="outline" className="bg-amber-100 text-amber-800">Vacant</Badge>;
  };

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
                <div className="text-2xl font-bold">{properties.length}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-md">
              <Check className="h-5 w-5" />
              <div>
                <div className="text-sm font-medium">Occupied</div>
                <div className="text-2xl font-bold">
                  {properties.filter(p => p.occupied).length}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-md">
              <X className="h-5 w-5" />
              <div>
                <div className="text-sm font-medium">Vacant</div>
                <div className="text-2xl font-bold">
                  {properties.filter(p => !p.occupied).length}
                </div>
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
          </TabsList>
        </Tabs>
        
        <Button className="bg-rental-primary hover:bg-rental-secondary">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Property
        </Button>
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
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-rental-text">{property.flatNumber}</CardTitle>
                  <CardDescription className="text-rental-text-light">{property.type} • {property.size}</CardDescription>
                </div>
                {getOccupancyBadge(property.occupied)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-rental-text-light">
                <User className="h-4 w-4 mr-2" />
                <span>{property.tenant || "No tenant assigned"}</span>
              </div>
              
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
                  {property.furnished ? 
                    <Badge variant="outline" className="bg-green-100 text-green-800">Furnished</Badge> :
                    <Badge variant="outline" className="bg-gray-100 text-gray-800">Unfurnished</Badge>
                  }
                </div>
              </div>
              
              <div>
                <p className="text-sm text-rental-text-light mb-1">Amenities:</p>
                <div className="flex flex-wrap gap-1">
                  {property.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline" className="text-xs">{amenity}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline" size="sm">View Details</Button>
              <Button variant="ghost" size="sm">Edit</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default PropertiesPage;
