
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
  signUp: (email: string, password: string, userData?: any) => Promise<{ success: boolean; error?: string; userId?: string }>;
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

  const handleRoleBasedRedirection = (role: string | null) => {
    if (!role) return;
    
    console.log('Redirecting based on role:', role);
    
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else if (role === 'tenant') {
      navigate('/tenant/dashboard');
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener');
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          const userId = currentSession.user.id;
          console.log("User authenticated:", userId);
          
          try {
            // Use setTimeout to prevent blocking the auth state change
            setTimeout(async () => {
              try {
                const profile = await fetchUserProfile(userId);
                if (profile) {
                  console.log("User profile loaded:", profile.role);
                  setUserRole(profile.role);
                  if (event === 'SIGNED_IN') {
                    handleRoleBasedRedirection(profile.role);
                  }
                } else {
                  console.log("No user profile found");
                }
              } catch (profileError) {
                console.error("Error fetching profile in timeout:", profileError);
              } finally {
                // Always ensure loading is set to false
                setLoading(false);
              }
            }, 0);
          } catch (error) {
            console.error('Error in auth state change handler:', error);
            setLoading(false);
          }
        } else {
          console.log("No authenticated user");
          setUserRole(null);
          setLoading(false);
        }
      }
    );

    // Then check for existing session - with a timeout to ensure it completes
    const initializeTimeout = setTimeout(() => {
      setLoading(false); // Ensure loading is set to false after timeout
      console.log("Auth initialization timed out, setting loading to false");
    }, 5000); // 5 second timeout
    
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        console.log('Initial session:', initialSession ? 'exists' : 'none');
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          clearTimeout(initializeTimeout);
          return;
        }
        
        if (initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          
          try {
            const profile = await fetchUserProfile(initialSession.user.id);
            if (profile) {
              console.log("Setting user role:", profile.role);
              setUserRole(profile.role);
            } else {
              console.log("No profile found for user");
            }
          } catch (profileError) {
            console.error('Error fetching profile during init:', profileError);
          }
        } else {
          console.log("No initial session found");
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        // Always ensure loading is set to false and clear timeout
        setLoading(false);
        clearTimeout(initializeTimeout);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
      clearTimeout(initializeTimeout);
    };
  }, [navigate]);

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

  const signUp = async (email: string, password: string, userData: any = {}) => {
    try {
      setLoading(true);
      
      console.log("Signing up user:", email);
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
        console.error('User object missing after signup');
        toast.error('Signup failed', { description: 'User could not be created' });
        return { success: false, error: 'User could not be created' };
      }

      console.log('Sign up successful, user ID:', data.user.id);
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

  const updateUserData = async (data: any) => {
    try {
      if (!user) return;
      
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);
        
      if (error) throw error;
      
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

  const contextValue = {
    user,
    session,
    userRole,
    loading,
    signIn,
    signUp,
    signOut,
    updateUserData,
  };

  console.log("Auth provider state:", { 
    hasUser: !!user, 
    userRole, 
    loading 
  });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
