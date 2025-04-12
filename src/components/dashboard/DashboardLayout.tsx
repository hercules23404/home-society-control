import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Building, 
  LayoutDashboard, 
  Bell, 
  MessageSquare, 
  FileText, 
  Users, 
  LogOut, 
  Menu, 
  X,
  User,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "tenant" | "admin";
}

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, society, signOut } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tenantItems: SidebarItem[] = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/tenant/dashboard" },
    { icon: <Bell size={20} />, label: "Notices", href: "/tenant/notices" },
    { icon: <MessageSquare size={20} />, label: "Requests", href: "/tenant/requests" },
    { icon: <Home size={20} />, label: "Properties", href: "/tenant/properties" },
    { icon: <FileText size={20} />, label: "Documents", href: "/tenant/documents" },
    { icon: <User size={20} />, label: "Profile", href: "/tenant/profile" },
  ];

  const adminItems: SidebarItem[] = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/admin/dashboard" },
    { icon: <Users size={20} />, label: "Tenants", href: "/admin/tenants" },
    { icon: <MessageSquare size={20} />, label: "Requests", href: "/admin/requests" },
    { icon: <Bell size={20} />, label: "Notices", href: "/admin/notices" },
    { icon: <Home size={20} />, label: "Properties", href: "/admin/properties" },
    { icon: <FileText size={20} />, label: "Documents", href: "/admin/documents" },
    { icon: <Building size={20} />, label: "Society", href: "/admin/society" },
  ];

  const items = role === "tenant" ? tenantItems : adminItems;

  const handleLogout = async () => {
    if (role === "admin") {
      await signOut();
    } else {
      localStorage.removeItem("userRole");
      navigate("/");
    }
  };

  const getInitials = () => {
    if (!user) return "U";
    const email = user.email || "";
    return email.charAt(0).toUpperCase();
  };

  const userDisplayName = user?.email || "User";
  const societyName = society?.name || "Society";

  return (
    <div className="min-h-screen bg-rental-background flex flex-col md:flex-row">
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Link to="/" className="flex items-center">
            <Building className="h-6 w-6 text-rental-primary mr-2" />
            <span className="font-bold text-rental-primary">RentalSystem</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={24} />
          </Button>
        </div>
        
        <div className="py-4 flex flex-col h-full">
          <div className="flex-grow">
            <nav className="px-2 space-y-1">
              {items.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                    location.pathname === item.href
                      ? "bg-rental-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="px-3 mt-6 mb-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden md:block w-64 bg-white border-r shrink-0">
        <div className="flex items-center h-16 px-6 border-b">
          <Link to="/" className="flex items-center">
            <Building className="h-6 w-6 text-rental-primary mr-2" />
            <span className="font-bold text-rental-primary">RentalSystem</span>
          </Link>
        </div>
        
        <div className="py-4 flex flex-col h-[calc(100vh-64px)]">
          <div className="flex-grow">
            <nav className="px-3 space-y-1">
              {items.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
                    location.pathname === item.href
                      ? "bg-rental-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="px-3 mt-6 mb-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <header className="h-16 bg-white border-b flex items-center justify-between px-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </Button>
            <h1 className="text-xl font-semibold text-rental-text ml-2 md:ml-0">
              {role === "tenant" ? "Tenant Dashboard" : societyName}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium hidden md:block">{userDisplayName}</span>
            <Avatar>
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
          </div>
        </header>
        
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
