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
import { mockRequests, mockTenants, mockProperties, mockNotices } from "@/utils/mockData";

const AdminDashboard = () => {
  const [requests] = useState(mockRequests);
  const [tenants] = useState(mockTenants);

  const totalTenants = tenants.length;
  const pendingTenants = tenants.filter(t => t.status === 'pending').length;
  const openRequests = requests.filter(r => r.status !== 'resolved').length;
  const propertiesCount = mockProperties.length;
  const noticesCount = mockNotices.length;

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

  const resolvedPercentage = 65;
  const inProgressPercentage = 20;
  const pendingPercentage = 10;
  const rejectedPercentage = 5;

  const verifiedPercentage = 75;
  const pendingVerificationPercentage = 20;
  const rejectedVerificationPercentage = 5;

  const stats = [
    {
      title: "Total Tenants",
      value: totalTenants.toString(),
      icon: <Users className="h-6 w-6" />,
      description: `${pendingTenants} pending verification`,
      color: "bg-blue-50 text-blue-700",
      path: "/admin/tenants",
    },
    {
      title: "Open Requests",
      value: openRequests.toString(),
      icon: <MessageSquare className="h-6 w-6" />,
      description: "5 new since last week",
      color: "bg-amber-50 text-amber-700",
      path: "/admin/requests",
    },
    {
      title: "Properties",
      value: propertiesCount.toString(),
      icon: <Home className="h-6 w-6" />,
      description: "3 new listings",
      color: "bg-green-50 text-green-700",
      path: "/admin/properties",
    },
    {
      title: "Notices",
      value: noticesCount.toString(),
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
                  <span>{resolvedPercentage}%</span>
                </div>
                <Progress value={resolvedPercentage} className="h-2 bg-gray-100" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-blue-700">
                    <Clock className="h-4 w-4 mr-1" /> In Progress
                  </span>
                  <span>{inProgressPercentage}%</span>
                </div>
                <Progress value={inProgressPercentage} className="h-2 bg-gray-100" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-amber-700">
                    <Clock className="h-4 w-4 mr-1" /> Pending
                  </span>
                  <span>{pendingPercentage}%</span>
                </div>
                <Progress value={pendingPercentage} className="h-2 bg-gray-100" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-red-700">
                    <XCircle className="h-4 w-4 mr-1" /> Rejected
                  </span>
                  <span>{rejectedPercentage}%</span>
                </div>
                <Progress value={rejectedPercentage} className="h-2 bg-gray-100" />
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
                  {tenants.slice(0, 3).map((tenant) => (
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
                  <span>{verifiedPercentage}%</span>
                </div>
                <Progress value={verifiedPercentage} className="h-2 bg-gray-100" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-amber-700">
                    <Clock className="h-4 w-4 mr-1" /> Pending
                  </span>
                  <span>{pendingVerificationPercentage}%</span>
                </div>
                <Progress value={pendingVerificationPercentage} className="h-2 bg-gray-100" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-red-700">
                    <UserX className="h-4 w-4 mr-1" /> Rejected
                  </span>
                  <span>{rejectedVerificationPercentage}%</span>
                </div>
                <Progress value={rejectedVerificationPercentage} className="h-2 bg-gray-100" />
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
