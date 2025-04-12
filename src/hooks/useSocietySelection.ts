
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useSocietySelection = () => {
  const [societies, setSocieties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchSocieties = async () => {
    try {
      setLoading(true);
      // Use the security definer function we created to avoid recursion issues
      const { data, error } = await supabase
        .rpc('get_societies');
      
      if (error) throw error;
      setSocieties(data || []);
      return data;
    } catch (error: any) {
      console.error('Error fetching societies:', error);
      toast.error('Error fetching societies', {
        description: error.message
      });
      return [];
    } finally {
      setLoading(false);
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
      console.error('Error assigning society:', error);
      toast.error('Error assigning society', {
        description: error.message
      });
    }
  };

  return { 
    societies, 
    fetchSocieties, 
    assignTenantToSociety,
    loading 
  };
};
