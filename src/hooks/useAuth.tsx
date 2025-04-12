
import { createContext, useContext, ReactNode } from 'react';

// Mock tenant data
const mockTenant = {
  id: 'test-tenant-id',
  email: 'tenant@example.com',
  name: 'Priya Singh',
  phone: '+91 87654 32109',
  role: 'tenant',
  flat_number: 'A-101'
};

// Mock society data (should match the admin's view)
const mockSociety = {
  id: 'test-society-id',
  name: 'Green Valley Apartments',
  address: '123 Park Avenue',
  city: 'Mumbai',
  state: 'Maharashtra',
  zip: '400001'
};

const mockSession = {
  access_token: 'mock-token',
  user: mockTenant,
};

type AuthContextType = {
  user: any;
  session: any;
  userRole: string;
  loading: boolean;
  society: any;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ success: boolean; error?: string; userId?: string }>;
  signOut: () => Promise<void>;
  updateUserData: (data: any) => Promise<void>;
};

// Create context with consistent mock data
const AuthContext = createContext<AuthContextType>({
  user: mockTenant,
  session: mockSession,
  userRole: 'tenant',
  loading: false,
  society: mockSociety,
  signIn: async () => ({ success: true }),
  signUp: async () => ({ success: true, userId: 'test-tenant-id' }),
  signOut: async () => {},
  updateUserData: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Mock implementations of auth functions
  const signIn = async () => ({ success: true });
  const signUp = async () => ({ success: true, userId: 'test-tenant-id' });
  const signOut = async () => {};
  const updateUserData = async () => {};

  const contextValue = {
    user: mockTenant,
    session: mockSession,
    userRole: 'tenant',
    loading: false,
    society: mockSociety,
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
