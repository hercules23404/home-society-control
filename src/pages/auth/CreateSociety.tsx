
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AuthLayout from "@/components/auth/AuthLayout";
import { SocietyForm } from "@/components/society/SocietyForm";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface LocationState {
  userId?: string;
  designation?: string;
}

const CreateSociety = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userRole, loading: authLoading } = useAuth();
  const [state, setState] = useState<LocationState>({});
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Extract state from location on component mount
  useEffect(() => {
    if (location.state) {
      console.log("Received state in CreateSociety:", location.state);
      setState(location.state as LocationState);
    } else {
      console.log("No state received in CreateSociety");
      // If no state but user is logged in, we can still create a society
    }
  }, [location.state]);

  // Redirect if user is not an admin
  useEffect(() => {
    if (!authLoading && userRole && userRole !== 'admin') {
      toast.error("Access denied. You must be an admin to create a society.");
      navigate("/");
    }
  }, [userRole, navigate, authLoading]);

  // Create admin handler to be passed to SocietyForm
  const handleSocietyCreated = async (societyId: string) => {
    if (isProcessing) return; // Prevent multiple submissions
    
    setIsProcessing(true);
    
    try {
      const userId = state?.userId || user?.id;
      const designation = state?.designation || 'Admin';
      
      // If we have userId and designation, create the admin record
      if (userId) {
        console.log("Creating admin record with:", {
          userId,
          designation,
          societyId
        });
        
        const { error } = await supabase
          .from('admins')
          .insert({
            user_id: userId,
            designation: designation,
            society_id: societyId
          });
        
        if (error) throw error;
        
        toast.success("Society and admin setup complete!");
        navigate("/admin/dashboard", { replace: true });
      } else {
        console.error("Missing required user information for admin setup");
        toast.error("Failed to complete setup", {
          description: "User information is missing. Please try again or contact support."
        });
      }
    } catch (error: any) {
      console.error("Error creating admin:", error);
      toast.error("Failed to complete setup", {
        description: error.message || "An error occurred during society setup"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (authLoading) {
    return (
      <AuthLayout 
        title="Create Your Society" 
        subtitle="Loading your information..."
        userType="admin"
      >
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-rental-primary" />
          <span className="sr-only">Loading authentication...</span>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Create Your Society" 
      subtitle="Set up details for the residential society you manage"
      userType="admin"
    >
      <SocietyForm onSocietyCreated={handleSocietyCreated} isProcessing={isProcessing} />
    </AuthLayout>
  );
};

export default CreateSociety;
