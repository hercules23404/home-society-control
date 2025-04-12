
import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building,
  MapPin,
  Phone,
  Mail,
  Users,
  Home,
  Edit,
  PenSquare,
} from "lucide-react";

import { AmenitiesSection } from "@/components/society/AmenitiesSection";
import { UtilityWorkersSection } from "@/components/society/UtilityWorkersSection";
import { mockSociety, mockUtilityWorkers } from "@/utils/mockData";

const SocietyPage = () => {
  const [amenities, setAmenities] = useState(mockSociety.amenities);
  const [utilityWorkers, setUtilityWorkers] = useState(mockUtilityWorkers);

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-rental-text">Society Details</h1>
        <p className="text-rental-text-light">
          Manage your society information and settings
        </p>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="mb-6">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="amenities">Amenities</TabsTrigger>
          <TabsTrigger value="utility-workers">Utility Workers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">{mockSociety.name}</CardTitle>
                <CardDescription className="flex items-center mt-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {mockSociety.address}, {mockSociety.city}, {mockSociety.state} - {mockSociety.zip}
                </CardDescription>
              </div>
              <Button size="sm" className="bg-rental-primary hover:bg-rental-secondary">
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-3 text-rental-primary" />
                      <span>{mockSociety.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-3 text-rental-primary" />
                      <span>{mockSociety.email}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Registration Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center">
                      <PenSquare className="h-4 w-4 mr-3 text-rental-primary" />
                      <span>Registration Number: {mockSociety.registrationNumber}</span>
                    </div>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-3 text-rental-primary" />
                      <span>Established: {mockSociety.establishedYear}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Flats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Building className="h-5 w-5 mr-2 text-rental-primary" />
                      <span className="text-2xl font-bold">{mockSociety.total_units}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Occupied Flats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Home className="h-5 w-5 mr-2 text-green-500" />
                      <span className="text-2xl font-bold">{mockSociety.occupiedFlats}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Vacant Flats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Home className="h-5 w-5 mr-2 text-amber-500" />
                      <span className="text-2xl font-bold">
                        {mockSociety.total_units - mockSociety.occupiedFlats}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="amenities">
          <Card>
            <CardContent className="p-4">
              <AmenitiesSection amenities={amenities} setAmenities={setAmenities} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="utility-workers">
          <Card>
            <CardContent className="p-4">
              <UtilityWorkersSection utilityWorkers={utilityWorkers} setUtilityWorkers={setUtilityWorkers} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default SocietyPage;
