
import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, ArrowDown, ArrowUp, MessageSquare } from "lucide-react";
import RequestCard from "@/components/dashboard/tenant/RequestCard";
import { mockRequests } from "@/utils/mockData";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RequestsPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Filter requests for the current tenant
  const tenantRequests = mockRequests.filter(request => 
    request.tenant_id === user?.id
  );

  // Further filter based on search term and tab
  const filteredRequests = tenantRequests
    .filter(request => {
      if (currentTab === "all") return true;
      return request.status === currentTab;
    })
    .filter(request => 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      request.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });

  return (
    <DashboardLayout role="tenant">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-rental-text">Service Requests</h1>
        <p className="text-rental-text-light">
          Create and manage maintenance and service requests
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button className="bg-rental-primary hover:bg-rental-secondary" asChild>
          <Link to="/tenant/requests/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Request
          </Link>
        </Button>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search requests..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          className="ml-2 gap-1"
          onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
        >
          {sortOrder === 'newest' ? (
            <>
              <ArrowDown className="h-4 w-4" />
              Newest
            </>
          ) : (
            <>
              <ArrowUp className="h-4 w-4" />
              Oldest
            </>
          )}
        </Button>
      </div>
      
      {filteredRequests.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium">No requests found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm ? 'Try a different search term' : 'You have not created any requests yet'}
          </p>
          <Button className="mt-4 bg-rental-primary hover:bg-rental-secondary" asChild>
            <Link to="/tenant/requests/new">Create Your First Request</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              id={request.id}
              title={request.title}
              description={request.description}
              status={request.status as "pending" | "in-progress" | "resolved" | "rejected"}
              date={request.date}
              category={request.category}
              assignedTo={request.assignedTo}
              onViewClick={(id) => console.log("View request", id)}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default RequestsPage;
