
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import NoticeCard from "@/components/dashboard/tenant/NoticeCard";
import RequestCard from "@/components/dashboard/tenant/RequestCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, MessageSquare, FileText, Home, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  mockNotices, 
  mockRequests, 
  mockDocuments, 
  mockProperties, 
  mockCurrentTenant 
} from "@/utils/mockData";
import { useAuth } from "@/hooks/useAuth";

const TenantDashboard = () => {
  const { user } = useAuth();
  const [recentNotices] = useState(mockNotices.slice(0, 2));
  const [recentRequests] = useState(mockRequests.filter(r => r.tenant_id === user.id).slice(0, 2));

  // Count statistics
  const noticesCount = mockNotices.length;
  const requestsCount = mockRequests.filter(r => r.tenant_id === user.id).length;
  const propertiesCount = mockProperties.length;
  const documentsCount = mockDocuments.filter(d => d.tenant_id === user.id).length;

  return (
    <DashboardLayout role="tenant">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-rental-text">Welcome Back, {mockCurrentTenant.name.split(' ')[0]}</h1>
        <p className="text-rental-text-light">Here's what's happening in your society</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Notices", icon: <Bell />, value: noticesCount, bgColor: "bg-blue-50 text-blue-700", path: "/tenant/notices" },
          { title: "Requests", icon: <MessageSquare />, value: requestsCount, bgColor: "bg-amber-50 text-amber-700", path: "/tenant/requests" },
          { title: "Properties", icon: <Home />, value: propertiesCount, bgColor: "bg-green-50 text-green-700", path: "/tenant/properties" },
          { title: "Documents", icon: <FileText />, value: documentsCount, bgColor: "bg-purple-50 text-purple-700", path: "/tenant/documents" },
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
              {recentRequests.length > 0 ? (
                recentRequests.map((request) => (
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
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">No recent requests</p>
              )}
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
