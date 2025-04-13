
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
  fromSignup?: boolean;
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

  // Redirect if user is not an admin and not in signup flow
  useEffect(() => {
    if (!authLoading) {
      // Allow access if coming from signup flow (state.fromSignup or state.userId exists)
      const isFromSignup = state.fromSignup || state.userId;
      
      if (!isFromSignup && userRole && userRole !== 'admin') {
        toast.error("Access denied. You must be an admin to create a society.");
        navigate("/");
      }
    }
  }, [userRole, navigate, authLoading, state]);

  // Handle society creation
  const handleSocietyCreated = async (societyId: string) => {
    if (isProcessing) return; // Prevent multiple submissions
    
    setIsProcessing(true);
    console.log("Starting society setup process...");
    
    try {
      const userId = state?.userId || user?.id;
      
      if (!userId) {
        throw new Error("No user ID available");
      }
      
      console.log("Processing society ID:", societyId);
      console.log("For user ID:", userId);
      
      // Step 1: Check if the user has a profile
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('id', userId)
        .single();
        
      if (profileCheckError) {
        console.error("Error checking profile existence:", profileCheckError);
        
        // Profile doesn't exist, create one
        if (profileCheckError.code === 'PGRST116') { // Code for no rows returned
          console.log("Profile not found, creating one...");
          
          const { error: createProfileError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: user?.email || '',
              role: 'admin',
              society_id: societyId
            });
            
          if (createProfileError) {
            console.error("Error creating profile:", createProfileError);
            throw new Error("Failed to create user profile");
          }
          
          console.log("Profile created successfully");
        } else {
          throw profileCheckError;
        }
      } else {
        // Profile exists, update it with society_id
        console.log("Updating existing profile with society ID:", {
          userId,
          societyId,
          existingProfile
        });
        
        const { error: updateProfileError } = await supabase
          .from('profiles')
          .update({
            society_id: societyId,
            role: 'admin'
          })
          .eq('id', userId);
        
        if (updateProfileError) {
          console.error("Error updating profile:", updateProfileError);
          throw updateProfileError;
        }
        
        console.log("Profile updated successfully");
      }
      
      // Step 2: Check if admin record exists
      const { data: existingAdmin, error: checkAdminError } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', userId);
        
      if (checkAdminError) {
        console.error("Error checking admin record:", checkAdminError);
        throw checkAdminError;
      }
      
      if (!existingAdmin || existingAdmin.length === 0) {
        // Create admin record if it doesn't exist
        console.log("Creating admin record...");
        const { error: adminError } = await supabase
          .from('admins')
          .insert({
            user_id: userId,
            society_id: societyId
          });
          
        if (adminError) {
          console.error("Error creating admin record:", adminError);
          throw adminError;
        }
        console.log("Admin record created successfully");
      } else {
        // Update existing admin record
        console.log("Updating admin record...");
        const { error: adminUpdateError } = await supabase
          .from('admins')
          .update({ society_id: societyId })
          .eq('user_id', userId);
          
        if (adminUpdateError) {
          console.error("Error updating admin record:", adminUpdateError);
          throw adminUpdateError;
        }
        console.log("Admin record updated successfully");
      }
      
      toast.success("Society setup complete!");
      
      // Refresh the session to make sure all changes are reflected
      await supabase.auth.refreshSession();
      console.log("Session refreshed");
      
      // Navigate to dashboard with replace to prevent going back to create society
      navigate("/admin/dashboard", { replace: true });
    } catch (error: any) {
      console.error("Society creation error:", error);
      toast.error("Failed to complete setup", {
        description: error.message || "An unexpected error occurred"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (authLoading && !state.fromSignup && !state.userId) {
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
