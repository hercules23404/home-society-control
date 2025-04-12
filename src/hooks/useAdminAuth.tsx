
import { createContext, useContext, ReactNode } from 'react';

// Detailed mock society data
const mockSociety = {
  id: 'test-society-id',
  name: 'Green Valley Apartments',
  address: '123 Park Avenue',
  city: 'Mumbai',
  state: 'Maharashtra',
  zip: '400001',
  total_units: 100,
  amenities: ['Swimming Pool', 'Gym', 'Community Hall', 'Gardens', 'CCTV Surveillance'],
  description: 'A premium residential society in the heart of Mumbai'
};

// Mock admin data
const mockAdmin = {
  id: 'test-admin-id', 
  email: 'admin@example.com',
  name: 'Rahul Sharma',
  phone: '+91 98765 43210',
  role: 'admin',
  designation: 'Society Manager'
};

interface AdminAuthContextType {
  user: any | null;
  isAdmin: boolean;
  loading: boolean;
  society: any | null;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: mockAdmin,
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
    user: mockAdmin,
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
