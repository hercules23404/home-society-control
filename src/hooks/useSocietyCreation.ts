
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { SocietyFormData } from '@/components/society/SocietyForm';

export const useSocietyCreation = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [utilityWorkers, setUtilityWorkers] = useState<{ name: string; role: string }[]>([]);

  const handleSubmitSociety = async (data: SocietyFormData) => {
    setIsLoading(true);
    
    try {
      // Step 1: Get current user
      const { data: authData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!authData?.user) throw new Error("User not authenticated");
      
      // Step 2: Create society in Supabase
      const { data: societyData, error: societyError } = await supabase
        .from('societies')
        .insert({
          name: data.name,
          address: data.address,
          city: data.city,
          state: data.state,
          zip_code: data.zip_code,
          total_units: parseInt(data.total_units),
          amenities: amenities,
        })
        .select()
        .single();
      
      if (societyError) throw societyError;
      
      // Step 3: First ensure user profile has admin role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', authData.user.id);
        
      if (profileError) {
        console.error("Error updating profile:", profileError);
        // Continue anyway - the profile might already be an admin
      }
      
      // Step 4: Create admin record connecting user to society
      const { error: adminError } = await supabase
        .from('admins')
        .insert({
          user_id: authData.user.id,
          society_id: societyData.id,
          designation: 'Owner'
        });
        
      if (adminError) {
        console.error("Error adding admin:", adminError);
        throw adminError;
      }
      
      // Step 5: Add utility workers if any
      if (utilityWorkers.length > 0 && societyData) {
        const workersToInsert = utilityWorkers.map(worker => ({
          name: worker.name,
          role: worker.role,
          society_id: societyData.id
        }));
        
        const { error: workersError } = await supabase
          .from('utility_workers')
          .insert(workersToInsert);
          
        if (workersError) {
          console.error("Error adding utility workers:", workersError);
          // We don't throw here to allow society creation to succeed even if worker creation fails
        }
      }
      
      toast.success("Society created successfully!");
      navigate("/admin/dashboard");
    } catch (error: any) {
      console.error("Society creation error:", error);
      toast.error("Failed to create society", {
        description: error.message || "An unexpected error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    amenities,
    setAmenities,
    utilityWorkers,
    setUtilityWorkers,
    handleSubmitSociety
  };
};
