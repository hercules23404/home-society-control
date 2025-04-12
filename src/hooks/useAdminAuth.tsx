
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';

interface AdminAuthContextType {
  user: any | null;
  isAdmin: boolean;
  loading: boolean;
  society: any | null;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  society: null,
  signOut: async () => {},
  refreshUser: async () => {},
});

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const { user: authUser, userRole, loading: authLoading, signOut: authSignOut } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [society, setSociety] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      setLoading(true);
      
      if (!authUser || userRole !== 'admin') {
        setUser(null);
        setSociety(null);
        setLoading(false);
        return;
      }
      
      try {
        // Fetch admin data
        const { data: adminData, error } = await supabase
          .from('admins')
          .select(`
            *,
            societies:society_id (*)
          `)
          .eq('user_id', authUser.id)
          .single();
        
        if (error || !adminData) {
          console.error('Error fetching admin data:', error);
          setUser(null);
          setSociety(null);
        } else {
          setUser(adminData);
          setSociety(adminData.societies);
        }
      } catch (error) {
        console.error('Error in admin auth check:', error);
        setUser(null);
        setSociety(null);
      } finally {
        setLoading(false);
      }
    };
    
    if (!authLoading) {
      checkAdminStatus();
    }
  }, [authUser, userRole, authLoading]);
  
  const signOut = async () => {
    await authSignOut();
    navigate('/admin/login');
  };
  
  const refreshUser = async () => {
    if (!authUser?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('admins')
        .select(`
          *,
          societies:society_id (*)
        `)
        .eq('user_id', authUser.id)
        .single();
      
      if (error) throw error;
      
      setUser(data);
      setSociety(data.societies);
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };
  
  const value = {
    user,
    isAdmin: !!user && userRole === 'admin',
    loading: authLoading || loading,
    society,
    signOut,
    refreshUser,
  };
  
  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
