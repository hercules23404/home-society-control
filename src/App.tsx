
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "@/hooks/useAdminAuth";
import { AuthProvider } from "@/hooks/useAuth";
import RouteProtection from "@/components/auth/RouteProtection";
import AdminRouteProtection from "@/components/auth/AdminRouteProtection";

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
import TenantNotices from "./pages/tenant/Notices";
import TenantProperties from "./pages/tenant/Properties";
import TenantRequests from "./pages/tenant/Requests";
import TenantPayments from "./pages/tenant/Payments";
import TenantForum from "./pages/tenant/Forum";
import TenantDocuments from "./pages/tenant/Documents";
import TenantProfile from "./pages/tenant/Profile";
import TenantServiceRequestCreate from "./pages/tenant/ServiceRequestCreate";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import TenantsPage from "./pages/admin/Tenants";
import RequestsPage from "./pages/admin/Requests";
import NoticesPage from "./pages/admin/Notices";
import PropertiesPage from "./pages/admin/Properties";
import DocumentsPage from "./pages/admin/Documents";
import SocietyPage from "./pages/admin/Society";
import ForumPage from "./pages/admin/Forum";
import PaymentsPage from "./pages/admin/Payments";
import AdminCreateNotice from "./pages/admin/CreateNotice";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

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
              
              {/* Authentication routes - no protection */}
              <Route path="/tenant/login" element={<TenantLogin />} />
              <Route path="/tenant/signup" element={<TenantSignup />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/signup" element={<AdminSignup />} />
              <Route path="/admin/create-society" element={<CreateSociety />} />
              
              {/* Tenant routes - protected */}
              <Route
                path="/tenant/dashboard"
                element={
                  <RouteProtection requiredRole="tenant">
                    <TenantDashboard />
                  </RouteProtection>
                }
              />
              <Route
                path="/tenant/notices"
                element={
                  <RouteProtection requiredRole="tenant">
                    <TenantNotices />
                  </RouteProtection>
                }
              />
              <Route
                path="/tenant/properties"
                element={
                  <RouteProtection requiredRole="tenant">
                    <TenantProperties />
                  </RouteProtection>
                }
              />
              <Route
                path="/tenant/requests"
                element={
                  <RouteProtection requiredRole="tenant">
                    <TenantRequests />
                  </RouteProtection>
                }
              />
              <Route
                path="/tenant/requests/new"
                element={
                  <RouteProtection requiredRole="tenant">
                    <TenantServiceRequestCreate />
                  </RouteProtection>
                }
              />
              <Route
                path="/tenant/payments"
                element={
                  <RouteProtection requiredRole="tenant">
                    <TenantPayments />
                  </RouteProtection>
                }
              />
              <Route
                path="/tenant/forum"
                element={
                  <RouteProtection requiredRole="tenant">
                    <TenantForum />
                  </RouteProtection>
                }
              />
              <Route
                path="/tenant/documents"
                element={
                  <RouteProtection requiredRole="tenant">
                    <TenantDocuments />
                  </RouteProtection>
                }
              />
              <Route
                path="/tenant/profile"
                element={
                  <RouteProtection requiredRole="tenant">
                    <TenantProfile />
                  </RouteProtection>
                }
              />
              
              {/* Admin routes - protected */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRouteProtection>
                    <AdminDashboard />
                  </AdminRouteProtection>
                }
              />
              <Route
                path="/admin/tenants"
                element={
                  <AdminRouteProtection>
                    <TenantsPage />
                  </AdminRouteProtection>
                }
              />
              <Route
                path="/admin/requests"
                element={
                  <AdminRouteProtection>
                    <RequestsPage />
                  </AdminRouteProtection>
                }
              />
              <Route
                path="/admin/notices"
                element={
                  <AdminRouteProtection>
                    <NoticesPage />
                  </AdminRouteProtection>
                }
              />
              <Route
                path="/admin/notices/create"
                element={
                  <AdminRouteProtection>
                    <AdminCreateNotice />
                  </AdminRouteProtection>
                }
              />
              <Route
                path="/admin/properties"
                element={
                  <AdminRouteProtection>
                    <PropertiesPage />
                  </AdminRouteProtection>
                }
              />
              <Route
                path="/admin/documents"
                element={
                  <AdminRouteProtection>
                    <DocumentsPage />
                  </AdminRouteProtection>
                }
              />
              <Route
                path="/admin/society"
                element={
                  <AdminRouteProtection>
                    <SocietyPage />
                  </AdminRouteProtection>
                }
              />
              <Route
                path="/admin/forum"
                element={
                  <AdminRouteProtection>
                    <ForumPage />
                  </AdminRouteProtection>
                }
              />
              <Route
                path="/admin/payments"
                element={
                  <AdminRouteProtection>
                    <PaymentsPage />
                  </AdminRouteProtection>
                }
              />
              
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
