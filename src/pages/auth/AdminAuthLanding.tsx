
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/components/auth/AuthLayout';

const AdminAuthLanding = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout
      title="Admin Portal"
      subtitle="Manage your society and residents efficiently"
      userType="admin"
    >
      <div className="space-y-6 mt-8">
        <Button
          onClick={() => navigate('/admin/login')}
          className="w-full py-6 text-lg flex items-center justify-center gap-3 bg-rental-primary hover:bg-rental-secondary transition-all"
        >
          <LogIn className="h-5 w-5" />
          Already have an account? Log in
        </Button>
        
        <Button
          onClick={() => navigate('/admin/signup')}
          variant="outline"
          className="w-full py-6 text-lg flex items-center justify-center gap-3 border-rental-primary text-rental-primary hover:bg-rental-primary/10 transition-all"
        >
          <UserPlus className="h-5 w-5" />
          New Admin? Sign up
        </Button>
      </div>
      
      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>Welcome to the admin portal of our Society Management System.</p>
        <p className="mt-1">Sign up to create your society or log in to manage your existing one.</p>
      </div>
    </AuthLayout>
  );
};

export default AdminAuthLanding;
