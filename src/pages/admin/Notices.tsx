
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
import { Search, PlusCircle, Calendar, Users, Info, Bell } from "lucide-react";
import { format } from "date-fns";

// Mock data for notices
const mockNotices = [
  {
    id: "1",
    title: "Water Supply Interruption",
    category: "maintenance",
    content: "Due to maintenance work, water supply will be interrupted on April 15th from 10:00 AM to 2:00 PM.",
    publishDate: new Date(2025, 3, 10),
    expiryDate: new Date(2025, 3, 16),
    audience: "all",
  },
  {
    id: "2",
    title: "Monthly Society Meeting",
    category: "meeting",
    content: "The monthly society meeting will be held on April 20th at 7:00 PM in the community hall.",
    publishDate: new Date(2025, 3, 8),
    expiryDate: new Date(2025, 3, 21),
    audience: "all",
  },
  {
    id: "3",
    title: "Parking Area Renovation",
    category: "maintenance",
    content: "The parking area renovation will start on April 25th and continue for one week. Please park your vehicles in the designated temporary parking area.",
    publishDate: new Date(2025, 3, 5),
    expiryDate: new Date(2025, 3, 30),
    audience: "all",
  },
  {
    id: "4",
    title: "Fire Drill Practice",
    category: "safety",
    content: "A fire drill practice will be conducted on April 18th at 11:00 AM. All residents are requested to participate.",
    publishDate: new Date(2025, 3, 12),
    expiryDate: new Date(2025, 3, 19),
    audience: "all",
  },
  {
    id: "5",
    title: "New Security Personnel Introduction",
    category: "security",
    content: "We are pleased to introduce our new security personnel who will be joining from April 22nd. Please cooperate with them.",
    publishDate: new Date(2025, 3, 20),
    expiryDate: new Date(2025, 5, 20),
    audience: "all",
  }
];

const NoticesPage = () => {
  const [notices] = useState(mockNotices);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");

  const filteredNotices = notices
    .filter(notice => {
      if (currentTab === "all") return true;
      return notice.category === currentTab;
    })
    .filter(notice => 
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      notice.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "maintenance":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Maintenance</Badge>;
      case "meeting":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Meeting</Badge>;
      case "safety":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Safety</Badge>;
      case "security":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Security</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-rental-text">Notices</h1>
        <p className="text-rental-text-light">
          Create and manage notices for your society
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="meeting">Meetings</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button className="bg-rental-primary hover:bg-rental-secondary">
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Notice
        </Button>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search notices..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNotices.map((notice) => (
          <Card key={notice.id} className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-xl text-rental-text">{notice.title}</CardTitle>
                {getCategoryBadge(notice.category)}
              </div>
              <CardDescription className="flex items-center mt-1">
                <Calendar className="h-3 w-3 mr-1" /> 
                Published on {format(notice.publishDate, "MMM d, yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-rental-text-light">{notice.content}</p>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <div className="flex items-center text-sm text-rental-text-light">
                <Bell className="h-3 w-3 mr-1" />
                <span>Expires: {format(notice.expiryDate, "MMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="ghost" size="sm">Delete</Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default NoticesPage;
