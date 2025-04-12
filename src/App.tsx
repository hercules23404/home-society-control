
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<Index />} />
          
          {/* Authentication routes */}
          <Route path="/tenant/login" element={<TenantLogin />} />
          <Route path="/tenant/signup" element={<TenantSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/create-society" element={<CreateSociety />} />
          
          {/* Tenant routes */}
          <Route path="/tenant/dashboard" element={<TenantDashboard />} />
          
          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
