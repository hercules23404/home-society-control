
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const [user, setUser] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [society, setSociety] = useState<any | null>(null);
  const navigate = useNavigate();

  const refreshUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setUser(null);
        setIsAdmin(false);
        setSociety(null);
        return;
      }

      setUser(user);

      // Check if user is an admin
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*, societies(*)')
        .eq('user_id', user.id)
        .single();

      if (adminError || !adminData) {
        setIsAdmin(false);
        setSociety(null);
        return;
      }

      setIsAdmin(true);
      setSociety(adminData.societies);
    } catch (error) {
      console.error('Error refreshing user:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();

    // Set up auth subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async () => {
      await refreshUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setSociety(null);
    navigate('/admin/login');
    toast.success('Signed out successfully');
  };

  return (
    <AdminAuthContext.Provider value={{ user, isAdmin, loading, society, signOut, refreshUser }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
