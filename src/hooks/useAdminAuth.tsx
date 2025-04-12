
import { createContext, useContext, ReactNode } from 'react';

interface AdminAuthContextType {
  user: any | null;
  isAdmin: boolean;
  loading: boolean;
  society: any | null;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Mock society data
const mockSociety = {
  id: 'test-society-id',
  name: 'Test Society',
  address: '123 Test Street',
  city: 'Test City',
  state: 'Test State',
  zip: '12345',
};

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: { id: 'test-admin-id', email: 'admin@example.com' },
  isAdmin: true,
  loading: false,
  society: mockSociety,
  signOut: async () => {},
  refreshUser: async () => {},
});

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  // Mock functions
  const signOut = async () => {};
  const refreshUser = async () => {};

  const value = {
    user: { id: 'test-admin-id', email: 'admin@example.com' },
    isAdmin: true,
    loading: false,
    society: mockSociety,
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
