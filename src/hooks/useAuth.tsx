
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type UserRole = 'tenant' | 'admin' | null;

type AuthContextType = {
  session: any;
  user: any;
  userRole: UserRole;
  loading: boolean;
  society: any;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ success: boolean; error?: string; userId?: string }>;
  signOut: () => Promise<void>;
  updateUserData: (data: any) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  userRole: null,
  loading: true,
  society: null,
  signIn: async () => ({ success: false, error: 'Not implemented' }),
  signUp: async () => ({ success: false, error: 'Not implemented', userId: undefined }),
  signOut: async () => {},
  updateUserData: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [society, setSociety] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state changed:', event);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // We don't make supabase calls directly in the callback to prevent deadlock
        if (newSession?.user) {
          // Use setTimeout(0) to defer execution to the next tick
          setTimeout(() => {
            fetchUserProfile(newSession.user.id);
          }, 0);
        } else {
          setUserRole(null);
          setSociety(null);
          setLoading(false);
        }
      }
    );

    // Then check for the existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      setLoading(true);
      
      // Small delay to ensure we don't hit recursion in RLS policies
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          societies:society_id (
            id, name, address, city, state, zip_code, amenities, total_units
          )
        `)
        .eq('id', userId)
        .single();
        
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        setLoading(false);
        return;
      }
      
      if (profileData) {
        setUserRole(profileData.role as UserRole);
        setSociety(profileData.societies);
        
        setUser(prev => ({
          ...prev,
          ...profileData,
          society_id: profileData.society_id,
          fullName: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || prev.email
        }));
        
        console.log('Profile data loaded:', {
          role: profileData.role,
          societyId: profileData.society_id
        });
      } else {
        console.log('User has no profile data');
        setUserRole(null);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error.message);
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      console.log("Signing up with data:", { email, userData });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData?.first_name || "",
            last_name: userData?.last_name || "",
            phone: userData?.phone || "",
            role: userData?.role || 'admin'
          }
        }
      });

      if (error) throw error;
      
      console.log("Signup successful, user data:", data);
      
      return { 
        success: true, 
        userId: data.user?.id 
      };
    } catch (error: any) {
      console.error('Signup error:', error.message);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast.success('You have been signed out');
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      toast.error('Failed to sign out');
    }
  };

  const updateUserData = async (data: any) => {
    try {
      if (!user?.id) throw new Error('No user logged in');

      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) throw error;

      setUser(prev => ({
        ...prev,
        ...data,
      }));

      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating user data:', error.message);
      toast.error('Failed to update profile');
      throw error;
    }
  };

  const value = {
    session,
    user,
    userRole,
    loading,
    society,
    signIn,
    signUp,
    signOut,
    updateUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
