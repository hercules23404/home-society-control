
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
      
      // First try to use the RPC function
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('get_societies');
      
      if (!rpcError && rpcData && rpcData.length > 0) {
        console.log('Societies fetched via RPC:', rpcData);
        setSocieties(rpcData);
        return rpcData;
      }
      
      // If RPC fails or returns empty, fallback to direct query
      if (rpcError) {
        console.warn('RPC error, falling back to direct query:', rpcError);
      }
      
      const { data: directData, error: directError } = await supabase
        .from('societies')
        .select('*');
      
      if (directError) throw directError;
      
      console.log('Societies fetched via direct query:', directData);
      setSocieties(directData || []);
      return directData;
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
