
import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
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

import AmenitiesSection from "@/components/society/AmenitiesSection";
import UtilityWorkersSection from "@/components/society/UtilityWorkersSection";

// Mock data
const mockSociety = {
  id: "1",
  name: "Green Valley Apartments",
  address: "123, Green Avenue",
  city: "Mumbai",
  state: "Maharashtra",
  pincode: "400001",
  email: "admin@greenvalley.com",
  phone: "+91 98765 43210",
  totalFlats: 100,
  occupiedFlats: 85,
  establishedYear: 2018,
  registrationNumber: "MHSOC123456",
  amenities: [
    "Swimming Pool",
    "Gym",
    "Community Hall",
    "Children's Play Area",
    "Gardens",
    "CCTV Surveillance",
    "24/7 Security",
    "Power Backup",
    "Rainwater Harvesting",
  ],
  utilityWorkers: [
    {
      id: "1",
      name: "Ramesh Sharma",
      role: "Security Guard",
      phone: "+91 87654 32109",
      shiftTiming: "Morning (6 AM - 2 PM)",
    },
    {
      id: "2",
      name: "Suresh Kumar",
      role: "Security Guard",
      phone: "+91 76543 21098",
      shiftTiming: "Evening (2 PM - 10 PM)",
    },
    {
      id: "3",
      name: "Mahesh Patil",
      role: "Security Guard",
      phone: "+91 65432 10987",
      shiftTiming: "Night (10 PM - 6 AM)",
    },
    {
      id: "4",
      name: "Lakshmi Devi",
      role: "Housekeeper",
      phone: "+91 54321 09876",
      shiftTiming: "Morning (7 AM - 3 PM)",
    },
    {
      id: "5",
      name: "Ganesh Rao",
      role: "Plumber",
      phone: "+91 43210 98765",
      shiftTiming: "On Call",
    },
    {
      id: "6",
      name: "Rajesh Kumar",
      role: "Electrician",
      phone: "+91 32109 87654",
      shiftTiming: "On Call",
    },
  ],
};

const SocietyPage = () => {
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
                  {mockSociety.address}, {mockSociety.city}, {mockSociety.state} - {mockSociety.pincode}
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
                      <span className="text-2xl font-bold">{mockSociety.totalFlats}</span>
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
                        {mockSociety.totalFlats - mockSociety.occupiedFlats}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="amenities">
          <AmenitiesSection amenities={mockSociety.amenities} />
        </TabsContent>
        
        <TabsContent value="utility-workers">
          <UtilityWorkersSection utilityWorkers={mockSociety.utilityWorkers} />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default SocietyPage;
