
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import NoticeCard from "@/components/dashboard/tenant/NoticeCard";
import RequestCard from "@/components/dashboard/tenant/RequestCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, MessageSquare, FileText, Home, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data
const mockNotices = [
  {
    id: "1",
    title: "Water Supply Interruption",
    content: "Due to maintenance work, water supply will be interrupted on Saturday from 10 AM to 2 PM.",
    date: "Apr 10, 2025",
    category: "maintenance" as const,
  },
  {
    id: "2",
    title: "Monthly Society Meeting",
    content: "The monthly society meeting will be held on Sunday at the community hall at 4 PM.",
    date: "Apr 15, 2025",
    category: "events" as const,
  },
];

const mockRequests = [
  {
    id: "1",
    title: "Plumbing Issue in Bathroom",
    description: "There is a water leakage under the sink in the master bathroom.",
    status: "in-progress" as const,
    date: "Apr 9, 2025",
    category: "Plumbing",
    assignedTo: "John Smith",
  },
  {
    id: "2",
    title: "Electrical Socket Not Working",
    description: "The electrical socket in the living room is not working properly.",
    status: "pending" as const,
    date: "Apr 8, 2025",
    category: "Electrical",
  },
];

const TenantDashboard = () => {
  const [recentNotices] = useState(mockNotices);
  const [recentRequests] = useState(mockRequests);

  return (
    <DashboardLayout role="tenant">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-rental-text">Welcome Back, User</h1>
        <p className="text-rental-text-light">Here's what's happening in your society</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Notices", icon: <Bell />, value: "5", bgColor: "bg-blue-50 text-blue-700", path: "/tenant/notices" },
          { title: "Requests", icon: <MessageSquare />, value: "3", bgColor: "bg-amber-50 text-amber-700", path: "/tenant/requests" },
          { title: "Properties", icon: <Home />, value: "12", bgColor: "bg-green-50 text-green-700", path: "/tenant/properties" },
          { title: "Documents", icon: <FileText />, value: "7", bgColor: "bg-purple-50 text-purple-700", path: "/tenant/documents" },
        ].map((item, index) => (
          <Card key={index} className="border shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div
                  className={`p-3 rounded-lg ${item.bgColor}`}
                >
                  {item.icon}
                </div>
                <span className="text-2xl font-bold">{item.value}</span>
              </div>
              <h3 className="font-medium mt-4 mb-2">{item.title}</h3>
              <Link
                to={item.path}
                className="inline-flex items-center text-sm text-rental-primary hover:text-rental-secondary"
              >
                View all
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">Recent Notices</CardTitle>
            <Button variant="ghost" asChild>
              <Link to="/tenant/notices" className="text-sm flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentNotices.map((notice) => (
                <NoticeCard
                  key={notice.id}
                  title={notice.title}
                  content={notice.content}
                  date={notice.date}
                  category={notice.category}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">Recent Requests</CardTitle>
            <Button variant="ghost" asChild>
              <Link to="/tenant/requests" className="text-sm flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  id={request.id}
                  title={request.title}
                  description={request.description}
                  status={request.status}
                  date={request.date}
                  category={request.category}
                  assignedTo={request.assignedTo}
                  onViewClick={(id) => console.log("View request", id)}
                />
              ))}
              <Button 
                className="w-full bg-rental-primary hover:bg-rental-secondary"
                asChild
              >
                <Link to="/tenant/requests/new">Create New Request</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TenantDashboard;
