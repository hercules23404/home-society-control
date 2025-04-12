
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AuthLayout from "@/components/auth/AuthLayout";
import { SocietyForm } from "@/components/society/SocietyForm";
import { useAuth } from "@/hooks/useAuth";

interface LocationState {
  userId?: string;
  designation?: string;
}

const CreateSociety = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [state, setState] = useState<LocationState>({});
  
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

  // Create admin handler to be passed to SocietyForm
  const handleSocietyCreated = async (societyId: string) => {
    const userId = state?.userId || user?.id;
    const designation = state?.designation || 'Admin';
    
    // If we have userId and designation, create the admin record
    if (userId) {
      try {
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
      } catch (error: any) {
        console.error("Error creating admin:", error);
        toast.error("Failed to complete setup", {
          description: error.message
        });
      }
    } else {
      console.log("Missing required user information for admin setup");
      toast.success("Society created successfully!");
      navigate("/admin/dashboard", { replace: true });
    }
  };

  return (
    <AuthLayout 
      title="Create Your Society" 
      subtitle="Set up details for the residential society you manage"
      userType="admin"
    >
      <SocietyForm onSocietyCreated={handleSocietyCreated} />
    </AuthLayout>
  );
};

export default CreateSociety;
