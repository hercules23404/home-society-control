
import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, XCircle, Search, Filter, MessageSquare } from "lucide-react";

// Mock data for service requests
const mockRequests = [
  {
    id: "1",
    title: "Plumbing Issue in Bathroom",
    description: "The shower is leaking and causing water damage to the floor.",
    tenant: "Amit Kumar",
    status: "in-progress",
    priority: "high",
    date: "Apr 9, 2025",
    flat: "A-101",
  },
  {
    id: "2",
    title: "Electrical Socket Not Working",
    description: "The socket in the living room isn't working properly.",
    tenant: "Priya Singh",
    status: "pending",
    priority: "medium",
    date: "Apr 8, 2025",
    flat: "B-205",
  },
  {
    id: "3",
    title: "Water Leakage from Ceiling",
    description: "There's water dripping from the ceiling when it rains.",
    tenant: "Rahul Sharma",
    status: "pending",
    priority: "high",
    date: "Apr 7, 2025",
    flat: "C-304",
  },
  {
    id: "4",
    title: "Main Door Lock Issue",
    description: "The lock is stiff and difficult to operate.",
    tenant: "Neha Gupta",
    status: "resolved",
    priority: "medium",
    date: "Apr 5, 2025",
    flat: "D-402",
  },
  {
    id: "5",
    title: "Window Not Closing Properly",
    description: "The bedroom window doesn't close completely and lets in rain.",
    tenant: "Vikram Malhotra",
    status: "rejected",
    priority: "low",
    date: "Apr 4, 2025",
    flat: "E-501",
  },
];

const RequestsPage = () => {
  const [requests] = useState(mockRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");

  const filteredRequests = requests
    .filter(request => {
      if (currentTab === "all") return true;
      return request.status === currentTab;
    })
    .filter(request => 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      request.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.flat.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return <Badge className="bg-green-600">Resolved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-600">In Progress</Badge>;
      default:
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Pending</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="outline" className="bg-red-100 text-red-800">High</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Medium</Badge>;
      case "low":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-rental-text">Service Requests</h1>
        <p className="text-rental-text-light">
          Manage maintenance and service requests from tenants
        </p>
      </div>

      <Card className="shadow-sm mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Request Status Overview</CardTitle>
          <CardDescription>
            Quick overview of service request status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-md">
              <Clock className="h-5 w-5" />
              <div>
                <div className="text-sm font-medium">Pending</div>
                <div className="text-2xl font-bold">
                  {requests.filter(r => r.status === "pending").length}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-md">
              <Clock className="h-5 w-5" />
              <div>
                <div className="text-sm font-medium">In Progress</div>
                <div className="text-2xl font-bold">
                  {requests.filter(r => r.status === "in-progress").length}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-md">
              <CheckCircle className="h-5 w-5" />
              <div>
                <div className="text-sm font-medium">Resolved</div>
                <div className="text-2xl font-bold">
                  {requests.filter(r => r.status === "resolved").length}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-md">
              <XCircle className="h-5 w-5" />
              <div>
                <div className="text-sm font-medium">Rejected</div>
                <div className="text-2xl font-bold">
                  {requests.filter(r => r.status === "rejected").length}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Manage Requests</CardTitle>
          <CardDescription>
            View and handle service requests from tenants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Requests</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search requests..."
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
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Flat</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.title}</TableCell>
                    <TableCell>{request.tenant}</TableCell>
                    <TableCell>{request.flat}</TableCell>
                    <TableCell>{request.date}</TableCell>
                    <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(request.status)}
                        {getStatusBadge(request.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-rental-primary hover:text-rental-secondary"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-rental-primary hover:text-rental-secondary"
                        >
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default RequestsPage;
