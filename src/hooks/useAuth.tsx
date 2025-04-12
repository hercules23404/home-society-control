
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type AuthContextType = {
  user: any | null;
  session: any | null;
  userRole: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateUserData: (data: any) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  userRole: null,
  loading: true,
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  signOut: async () => {},
  updateUserData: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile and role
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, first_name, last_name')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return profile;
    } catch (error) {
      console.error('Unexpected error fetching user profile:', error);
      return null;
    }
  };

  // Handle user redirection based on role
  const handleRoleBasedRedirection = (role: string | null) => {
    if (!role) return;
    
    console.log('Redirecting based on role:', role);
    
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else if (role === 'tenant') {
      navigate('/tenant/dashboard');
    }
  };

  // Initialize auth state and set up change listener
  useEffect(() => {
    console.log('Setting up auth state listener');
    setLoading(true);
    
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Use setTimeout to avoid potential auth deadlocks
          setTimeout(async () => {
            const profile = await fetchUserProfile(currentSession.user.id);
            if (profile) {
              setUserRole(profile.role);
              // Only redirect on SIGNED_IN events to avoid loops
              if (event === 'SIGNED_IN') {
                handleRoleBasedRedirection(profile.role);
              }
            }
            setLoading(false);
          }, 0);
        } else {
          setUserRole(null);
          setLoading(false);
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          
          const profile = await fetchUserProfile(initialSession.user.id);
          if (profile) {
            setUserRole(profile.role);
            // Don't redirect on initial load to prevent unwanted redirects
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        toast.error('Login failed', { description: error.message });
        return { success: false, error: error.message };
      }

      if (!data.session) {
        toast.error('Login failed', { description: 'Session could not be established' });
        return { success: false, error: 'Session could not be established' };
      }

      // Session will be picked up by the onAuthStateChange listener
      console.log('Sign in successful');
      toast.success('Sign in successful');
      
      return { success: true };
    } catch (error: any) {
      console.error('Unexpected login error:', error);
      toast.error('Login failed', { description: error.message });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, userData: any = {}) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) {
        console.error('Signup error:', error);
        toast.error('Signup failed', { description: error.message });
        return { success: false, error: error.message };
      }

      if (!data.user) {
        toast.error('Signup failed', { description: 'User could not be created' });
        return { success: false, error: 'User could not be created' };
      }

      console.log('Sign up successful');
      toast.success('Sign up successful');
      
      return { success: true, userId: data.user.id };
    } catch (error: any) {
      console.error('Unexpected signup error:', error);
      toast.error('Signup failed', { description: error.message });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setUserRole(null);
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Sign out failed');
    } finally {
      setLoading(false);
    }
  };

  // Update user data function
  const updateUserData = async (data: any) => {
    try {
      if (!user) return;
      
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local state if needed
      if (data.role) {
        setUserRole(data.role);
      }
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating user data:', error);
      toast.error('Failed to update profile', { description: error.message });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userRole,
        loading,
        signIn,
        signUp,
        signOut,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
