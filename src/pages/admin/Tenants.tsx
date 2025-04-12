
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
import { CheckCircle, Clock, UserX, Search, Filter, UserCheck, UserPlus } from "lucide-react";
import { mockTenants } from "@/utils/mockData";

const TenantsPage = () => {
  const [tenants] = useState(mockTenants);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTenants = tenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tenant.flat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Count tenants by status
  const verifiedCount = tenants.filter(tenant => tenant.status === "verified").length;
  const pendingCount = tenants.filter(tenant => tenant.status === "pending").length;
  const rejectedCount = tenants.filter(tenant => tenant.status === "rejected").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-600">Verified</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "rejected":
        return <UserX className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-rental-text">Tenant Management</h1>
        <p className="text-rental-text-light">
          Manage and verify all tenants in your society
        </p>
      </div>

      <Card className="shadow-sm mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Tenant Status Overview</CardTitle>
          <CardDescription>
            Quick overview of tenant verification status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-md">
              <UserCheck className="h-5 w-5" />
              <div>
                <div className="text-sm font-medium">Verified</div>
                <div className="text-2xl font-bold">{verifiedCount}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-md">
              <Clock className="h-5 w-5" />
              <div>
                <div className="text-sm font-medium">Pending</div>
                <div className="text-2xl font-bold">{pendingCount}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-md">
              <UserX className="h-5 w-5" />
              <div>
                <div className="text-sm font-medium">Rejected</div>
                <div className="text-2xl font-bold">{rejectedCount}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle>Tenants</CardTitle>
            <CardDescription>
              View and manage all tenants in your society
            </CardDescription>
          </div>
          <Button className="bg-rental-primary hover:bg-rental-secondary">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Tenant
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search tenants..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>Flat No</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Joined On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">{tenant.name}</TableCell>
                    <TableCell>{tenant.flat}</TableCell>
                    <TableCell>
                      <div>{tenant.email}</div>
                      <div className="text-sm text-muted-foreground">{tenant.phone}</div>
                    </TableCell>
                    <TableCell>{tenant.joinedOn}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(tenant.status)}
                        {getStatusBadge(tenant.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rental-primary hover:text-rental-secondary"
                      >
                        View Details
                      </Button>
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

export default TenantsPage;
