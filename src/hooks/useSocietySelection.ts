
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useSocietySelection = () => {
  const [societies, setSocieties] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchSocieties = async () => {
    try {
      // Fetch all societies without any restrictions
      const { data, error } = await supabase
        .from('societies')
        .select('id, name, address, city, state');
      
      if (error) throw error;
      setSocieties(data || []);
      return data;
    } catch (error: any) {
      toast.error('Error fetching societies', {
        description: error.message
      });
      return [];
    }
  };

  const assignTenantToSociety = async (societyId: string) => {
    try {
      const { error } = await supabase
        .from('tenants')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          society_id: societyId,
          flat_number: '' // To be updated later
        });
      
      if (error) throw error;
      
      // Update user profile to confirm tenant role
      await supabase
        .from('profiles')
        .update({ role: 'tenant' })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      toast.success('Society assigned successfully');
      navigate('/tenant/dashboard');
    } catch (error: any) {
      toast.error('Error assigning society', {
        description: error.message
      });
    }
  };

  return { 
    societies, 
    fetchSocieties, 
    assignTenantToSociety 
  };
};
