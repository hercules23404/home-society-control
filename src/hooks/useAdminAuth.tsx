
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  const refreshUser = async () => {
    try {
      console.log('Refreshing admin user...');
      
      // Add a timeout to ensure we don't get stuck in loading
      const timeoutId = setTimeout(() => {
        console.log("Admin auth refresh timed out, setting loading to false");
        setLoading(false);
      }, 5000);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      // Clear timeout since we got a response
      clearTimeout(timeoutId);
      
      if (userError) {
        console.error('Error getting user:', userError);
        setUser(null);
        setIsAdmin(false);
        setSociety(null);
        setLoading(false);
        return;
      }
      
      if (!user) {
        console.log("No user found in admin auth refresh");
        setUser(null);
        setIsAdmin(false);
        setSociety(null);
        setLoading(false);
        return;
      }

      setUser(user);

      // Check if we're on the create-society page from signup flow
      // If so, we skip the admin check as the user is in the process of becoming an admin
      const isCreateSocietyPage = location.pathname === '/admin/create-society';
      const isFromSignup = location.state && 
        ((location.state as any).userId || (location.state as any).fromSignup);
      
      if (isCreateSocietyPage && isFromSignup) {
        console.log("User is in society creation flow, skipping admin check");
        setIsAdmin(true); // Temporarily set as admin for this flow
        setLoading(false);
        return;
      }

      // Check if user is an admin
      try {
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('*, society:societies(*)')
          .eq('user_id', user.id)
          .maybeSingle();

        if (adminError) {
          console.error('Error checking admin status:', adminError);
          setIsAdmin(false);
          setSociety(null);
        } else if (!adminData) {
          console.log('Not an admin');
          setIsAdmin(false);
          setSociety(null);
        } else {
          console.log("User is admin with society:", adminData.society?.name);
          setIsAdmin(true);
          setSociety(adminData.society);
        }
      } catch (adminCheckError) {
        console.error('Error checking admin status:', adminCheckError);
        setIsAdmin(false);
        setSociety(null);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
      setIsAdmin(false);
      setSociety(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log("Admin auth initialization timed out, setting loading to false");
      setLoading(false);
    }, 5000);
    
    refreshUser();

    // Set up auth subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      console.log('Admin auth state changed:', event);
      try {
        await refreshUser();
      } catch (error) {
        console.error('Error in admin auth state change handler:', error);
        setLoading(false);
      }
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [location.pathname]); // Re-run when path changes to handle navigation between routes properly

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
      setSociety(null);
      navigate('/admin/login');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Admin sign out error:', error);
      toast.error('Sign out failed');
    } finally {
      setLoading(false);
    }
  };

  console.log("Admin auth provider state:", { 
    hasUser: !!user, 
    isAdmin, 
    hasSociety: !!society, 
    loading,
    pathname: location.pathname,
    isCreateSocietyPage: location.pathname === '/admin/create-society',
    hasSignupState: !!location.state && ((location.state as any).userId || (location.state as any).fromSignup)
  });

  return (
    <AdminAuthContext.Provider value={{ user, isAdmin, loading, society, signOut, refreshUser }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
