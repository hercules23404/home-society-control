
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
import TenantNotices from "./pages/tenant/Notices";
import TenantProperties from "./pages/tenant/Properties";
import TenantRequests from "./pages/tenant/Requests";
import TenantPayments from "./pages/tenant/Payments";
import TenantForum from "./pages/tenant/Forum";
import TenantDocuments from "./pages/tenant/Documents";

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
              
              {/* Authentication routes - no protection */}
              <Route path="/tenant/login" element={<TenantLogin />} />
              <Route path="/tenant/signup" element={<TenantSignup />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/signup" element={<AdminSignup />} />
              <Route path="/admin/create-society" element={<CreateSociety />} />
              
              {/* Tenant routes - no protection */}
              <Route path="/tenant/dashboard" element={<TenantDashboard />} />
              <Route path="/tenant/notices" element={<TenantNotices />} />
              <Route path="/tenant/properties" element={<TenantProperties />} />
              <Route path="/tenant/requests" element={<TenantRequests />} />
              <Route path="/tenant/payments" element={<TenantPayments />} />
              <Route path="/tenant/forum" element={<TenantForum />} />
              <Route path="/tenant/documents" element={<TenantDocuments />} />
              
              {/* Admin routes - no protection */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/tenants" element={<TenantsPage />} />
              <Route path="/admin/requests" element={<RequestsPage />} />
              <Route path="/admin/notices" element={<NoticesPage />} />
              <Route path="/admin/properties" element={<PropertiesPage />} />
              <Route path="/admin/documents" element={<DocumentsPage />} />
              <Route path="/admin/society" element={<SocietyPage />} />
              <Route path="/admin/forum" element={<ForumPage />} />
              <Route path="/admin/payments" element={<PaymentsPage />} />
              
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
