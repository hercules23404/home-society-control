
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  MessageSquare,
  Bell,
  CheckCircle,
  Clock,
  XCircle,
  UserCheck,
  UserX,
  ChevronRight,
  Home,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data
const mockRequests = [
  {
    id: "1",
    title: "Plumbing Issue in Bathroom",
    tenant: "Amit Kumar",
    status: "in-progress" as const,
    date: "Apr 9, 2025",
    flat: "A-101",
  },
  {
    id: "2",
    title: "Electrical Socket Not Working",
    tenant: "Priya Singh",
    status: "pending" as const,
    date: "Apr 8, 2025",
    flat: "B-205",
  },
  {
    id: "3",
    title: "Water Leakage from Ceiling",
    tenant: "Rahul Sharma",
    status: "pending" as const,
    date: "Apr 7, 2025",
    flat: "C-304",
  },
  {
    id: "4",
    title: "Main Door Lock Issue",
    tenant: "Neha Gupta",
    status: "resolved" as const,
    date: "Apr 5, 2025",
    flat: "D-402",
  },
];

const mockTenants = [
  {
    id: "1",
    name: "Amit Kumar",
    flat: "A-101",
    status: "verified",
    joinedOn: "Mar 15, 2025",
  },
  {
    id: "2",
    name: "Priya Singh",
    flat: "B-205",
    status: "pending",
    joinedOn: "Apr 2, 2025",
  },
  {
    id: "3",
    name: "Rahul Sharma",
    flat: "C-304",
    status: "verified",
    joinedOn: "Feb 20, 2025",
  },
];

const AdminDashboard = () => {
  const [requests] = useState(mockRequests);
  const [tenants] = useState(mockTenants);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-600">Verified</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRequestStatusBadge = (status: string) => {
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

  const stats = [
    {
      title: "Total Tenants",
      value: "42",
      icon: <Users className="h-6 w-6" />,
      description: "8 pending verification",
      color: "bg-blue-50 text-blue-700",
      path: "/admin/tenants",
    },
    {
      title: "Open Requests",
      value: "15",
      icon: <MessageSquare className="h-6 w-6" />,
      description: "5 new since last week",
      color: "bg-amber-50 text-amber-700",
      path: "/admin/requests",
    },
    {
      title: "Properties",
      value: "38",
      icon: <Home className="h-6 w-6" />,
      description: "3 new listings",
      color: "bg-green-50 text-green-700",
      path: "/admin/properties",
    },
    {
      title: "Notices",
      value: "7",
      icon: <Bell className="h-6 w-6" />,
      description: "2 posted this month",
      color: "bg-purple-50 text-purple-700",
      path: "/admin/notices",
    },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-rental-text">Admin Dashboard</h1>
        <p className="text-rental-text-light">
          Manage your society and residents efficiently
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="border shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  {stat.icon}
                </div>
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <h3 className="font-medium mt-4 mb-1">{stat.title}</h3>
              <p className="text-sm text-rental-text-light mb-3">
                {stat.description}
              </p>
              <Link
                to={stat.path}
                className="inline-flex items-center text-sm text-rental-primary hover:text-rental-secondary"
              >
                View details
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-bold">Service Requests</CardTitle>
              <CardDescription>
                Recent maintenance and service requests from tenants
              </CardDescription>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/admin/requests" className="text-sm flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Flat</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.title}</TableCell>
                      <TableCell>{request.tenant}</TableCell>
                      <TableCell>{request.flat}</TableCell>
                      <TableCell>{request.date}</TableCell>
                      <TableCell>{getRequestStatusBadge(request.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Request Status</CardTitle>
            <CardDescription>
              Overview of all maintenance requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-green-700">
                    <CheckCircle className="h-4 w-4 mr-1" /> Resolved
                  </span>
                  <span>65%</span>
                </div>
                <Progress value={65} className="h-2 bg-gray-100" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-blue-700">
                    <Clock className="h-4 w-4 mr-1" /> In Progress
                  </span>
                  <span>20%</span>
                </div>
                <Progress value={20} className="h-2 bg-gray-100" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-amber-700">
                    <Clock className="h-4 w-4 mr-1" /> Pending
                  </span>
                  <span>10%</span>
                </div>
                <Progress value={10} className="h-2 bg-gray-100" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-red-700">
                    <XCircle className="h-4 w-4 mr-1" /> Rejected
                  </span>
                  <span>5%</span>
                </div>
                <Progress value={5} className="h-2 bg-gray-100" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-bold">Recent Tenants</CardTitle>
              <CardDescription>
                Latest tenants who joined your society
              </CardDescription>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/admin/tenants" className="text-sm flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Flat</TableHead>
                    <TableHead>Joined On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenants.map((tenant) => (
                    <TableRow key={tenant.id}>
                      <TableCell className="font-medium">{tenant.name}</TableCell>
                      <TableCell>{tenant.flat}</TableCell>
                      <TableCell>{tenant.joinedOn}</TableCell>
                      <TableCell>{getStatusBadge(tenant.status)}</TableCell>
                      <TableCell>
                        <Link 
                          to={`/admin/tenants/${tenant.id}`}
                          className="text-sm text-rental-primary hover:underline"
                        >
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Tenant Verification</CardTitle>
            <CardDescription>
              Status of tenant verification process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-green-700">
                    <UserCheck className="h-4 w-4 mr-1" /> Verified
                  </span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2 bg-gray-100" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-amber-700">
                    <Clock className="h-4 w-4 mr-1" /> Pending
                  </span>
                  <span>20%</span>
                </div>
                <Progress value={20} className="h-2 bg-gray-100" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-red-700">
                    <UserX className="h-4 w-4 mr-1" /> Rejected
                  </span>
                  <span>5%</span>
                </div>
                <Progress value={5} className="h-2 bg-gray-100" />
              </div>

              <Button 
                className="w-full bg-rental-primary hover:bg-rental-secondary mt-4"
                asChild
              >
                <Link to="/admin/tenants?status=pending">
                  Verify Pending Tenants
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
