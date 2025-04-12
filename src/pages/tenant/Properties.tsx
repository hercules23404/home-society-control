
import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Home, BedDouble, Bath } from "lucide-react";
import PropertyCard from "@/components/dashboard/tenant/PropertyCard";
import { mockProperties } from "@/utils/mockData";
import { useAuth } from "@/hooks/useAuth";

const PropertiesPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter properties for the current tenant's society
  // Instead of filtering by tenant_id (which doesn't exist), we'll filter by society_id
  const societyProperties = mockProperties.filter(property => 
    property.society_id === user?.society_id
  );

  // Further filter based on search term
  const filteredProperties = societyProperties.filter(property => 
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    property.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="tenant">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-rental-text">My Properties</h1>
        <p className="text-rental-text-light">
          View and manage your rented properties
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search properties..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button className="bg-rental-primary hover:bg-rental-secondary ml-2">
          <Plus className="h-4 w-4 mr-2" />
          Request New Property
        </Button>
      </div>
      
      {filteredProperties.length === 0 ? (
        <div className="text-center py-12">
          <Home className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium">No properties found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm ? 'Try a different search term' : 'You do not have any properties assigned yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              title={property.title}
              address={property.address}
              type={property.type === "rent" ? "rent" : "sale"}
              price={property.price}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              area={property.area_sqft}
              image={property.images[0]}
              onViewClick={(id) => console.log(`View property ${id}`)}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default PropertiesPage;
