
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "@/hooks/useAdminAuth";
import { AuthProvider } from "@/hooks/useAuth";

// Landing page
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Auth pages
import TenantLogin from "./pages/auth/TenantLogin";
import TenantSignup from "./pages/auth/TenantSignup";
import AdminLogin from "./pages/auth/AdminLogin";
import AdminSignup from "./pages/auth/AdminSignup";
import CreateSociety from "./pages/auth/CreateSociety";

// Tenant pages
import TenantDashboard from "./pages/tenant/Dashboard";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import TenantsPage from "./pages/admin/Tenants";
import RequestsPage from "./pages/admin/Requests";
import NoticesPage from "./pages/admin/Notices";
import PropertiesPage from "./pages/admin/Properties";
import DocumentsPage from "./pages/admin/Documents";
import SocietyPage from "./pages/admin/Society";

// Route Protection
import AdminRouteProtection from "./components/auth/AdminRouteProtection";
import RouteProtection from "./components/auth/RouteProtection";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <AdminAuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Landing page */}
              <Route path="/" element={<Index />} />
              
              {/* Authentication routes */}
              <Route path="/tenant/login" element={<TenantLogin />} />
              <Route path="/tenant/signup" element={<TenantSignup />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/signup" element={<AdminSignup />} />
              <Route path="/admin/create-society" element={
                <RouteProtection requiredRole="admin">
                  <CreateSociety />
                </RouteProtection>
              } />
              
              {/* Tenant routes */}
              <Route path="/tenant/dashboard" element={
                <RouteProtection requiredRole="tenant">
                  <TenantDashboard />
                </RouteProtection>
              } />
              
              {/* Admin routes - protected */}
              <Route path="/admin/dashboard" element={
                <AdminRouteProtection>
                  <AdminDashboard />
                </AdminRouteProtection>
              } />
              <Route path="/admin/tenants" element={
                <AdminRouteProtection>
                  <TenantsPage />
                </AdminRouteProtection>
              } />
              <Route path="/admin/requests" element={
                <AdminRouteProtection>
                  <RequestsPage />
                </AdminRouteProtection>
              } />
              <Route path="/admin/notices" element={
                <AdminRouteProtection>
                  <NoticesPage />
                </AdminRouteProtection>
              } />
              <Route path="/admin/properties" element={
                <AdminRouteProtection>
                  <PropertiesPage />
                </AdminRouteProtection>
              } />
              <Route path="/admin/documents" element={
                <AdminRouteProtection>
                  <DocumentsPage />
                </AdminRouteProtection>
              } />
              <Route path="/admin/society" element={
                <AdminRouteProtection>
                  <SocietyPage />
                </AdminRouteProtection>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AdminAuthProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
