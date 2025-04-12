
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AuthLayout from "@/components/auth/AuthLayout";
import { SocietyForm } from "@/components/society/SocietyForm";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface LocationState {
  userId?: string;
  designation?: string;
}

const CreateSociety = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshUser } = useAdminAuth();
  const [state, setState] = useState<LocationState>({});
  
  // Extract state from location on component mount
  useEffect(() => {
    if (location.state) {
      console.log("Received state in CreateSociety:", location.state);
      setState(location.state as LocationState);
    } else {
      console.log("No state received in CreateSociety");
      // If no state but user is already logged in, we can still create a society
      // They will just need to manually create an admin record later
    }
  }, [location.state]);

  // Create admin handler to be passed to SocietyForm
  const handleSocietyCreated = async (societyId: string) => {
    // If we have userId and designation from registration flow,
    // create the admin record
    if (state?.userId && state?.designation) {
      try {
        console.log("Creating admin record with:", {
          userId: state.userId,
          designation: state.designation,
          societyId
        });
        
        const { error } = await supabase
          .from('admins')
          .insert({
            user_id: state.userId,
            designation: state.designation,
            society_id: societyId
          });
        
        if (error) throw error;
        
        // Refresh the user data to include admin status
        await refreshUser();
        
        toast.success("Society and admin setup complete!");
        navigate("/admin/dashboard");
      } catch (error: any) {
        console.error("Error creating admin:", error);
        toast.error("Failed to complete setup", {
          description: error.message
        });
      }
    } else {
      console.log("Missing required user information for admin setup");
      toast.success("Society created successfully!");
      navigate("/admin/dashboard");
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
