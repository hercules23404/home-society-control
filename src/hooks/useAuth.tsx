
import { createContext, useContext, ReactNode } from 'react';

type AuthContextType = {
  user: any;
  session: any;
  userRole: string;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ success: boolean; error?: string; userId?: string }>;
  signOut: () => Promise<void>;
  updateUserData: (data: any) => Promise<void>;
};

// Mock user data for testing
const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
};

const mockSession = {
  access_token: 'mock-token',
  user: mockUser,
};

// Create context with mock data
const AuthContext = createContext<AuthContextType>({
  user: mockUser,
  session: mockSession,
  userRole: 'admin', // Default as admin, but you can switch between roles for testing
  loading: false,
  signIn: async () => ({ success: true }),
  signUp: async () => ({ success: true, userId: 'test-user-id' }),
  signOut: async () => {},
  updateUserData: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Mock implementations of auth functions
  const signIn = async () => ({ success: true });
  const signUp = async () => ({ success: true, userId: 'test-user-id' });
  const signOut = async () => {};
  const updateUserData = async () => {};

  const contextValue = {
    user: mockUser,
    session: mockSession,
    userRole: 'admin', // Change to 'tenant' to test tenant views
    loading: false,
    signIn,
    signUp,
    signOut,
    updateUserData,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
