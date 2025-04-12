
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

const TenantLogin = () => {
  const navigate = useNavigate();

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (authError) throw authError;

      // Check if user is a tenant
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user?.id)
        .single();

      if (profileError) throw profileError;

      if (profileData.role !== 'tenant') {
        await supabase.auth.signOut();
        throw new Error('Access denied. Please use the correct login method.');
      }

      // Check if tenant is assigned to a society
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .select('society_id')
        .eq('user_id', authData.user?.id)
        .single();

      if (tenantError) {
        toast.error('You are not assigned to a society', {
          description: 'Please contact your society admin or sign up again.'
        });
        await supabase.auth.signOut();
        return;
      }

      toast.success('Login successful');
      navigate('/tenant/dashboard');
    } catch (error: any) {
      toast.error('Login failed', {
        description: error.message
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="absolute top-4 left-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/')}
          aria-label="Return to home"
        >
          <Home className="h-5 w-5" />
        </Button>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Tenant Login</CardTitle>
          <CardDescription>
            Login to access your tenant dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input 
                {...register('email')}
                type="email" 
                placeholder="Enter your email" 
              />
              {errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email.message?.toString()}
                </p>
              )}
            </div>

            <div>
              <Label>Password</Label>
              <Input 
                {...register('password')}
                type="password" 
                placeholder="Enter your password" 
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message?.toString()}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Login
            </Button>

            <div className="text-center">
              <p>
                Don't have an account? {' '}
                <Link 
                  to="/tenant/signup" 
                  className="text-blue-600 hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantLogin;
