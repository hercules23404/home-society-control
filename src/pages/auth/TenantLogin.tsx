import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

const TenantLogin = () => {
  const navigate = useNavigate();
  const { signIn, user, userRole, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("Auth state changed in TenantLogin:", { user: !!user, userRole });
    
    if (user) {
      if (userRole === 'tenant') {
        console.log("Redirecting authenticated tenant to dashboard");
        navigate('/tenant/dashboard', { replace: true });
      } else if (userRole === 'admin') {
        console.log("Admin detected, redirecting to admin dashboard");
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [user, userRole, navigate]);

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    if (isLoading) return; // Prevent multiple submissions
    
    setIsLoading(true);
    
    try {
      const result = await signIn(data.email, data.password);
      
      if (!result.success) {
        throw new Error(result.error || 'Login failed');
      }
      
      toast.success('Login successful! Redirecting...');
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error('Login failed', { 
        description: error.message || 'Please check your credentials and try again' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const shouldShowForm = !isLoading && (!authLoading || user === null);
  
  const showAuthLoader = authLoading && user !== null;

  console.log("TenantLogin render state:", { authLoading, isLoading, user: !!user, shouldShowForm, showAuthLoader });

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
          {showAuthLoader ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-rental-primary" />
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
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

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Logging in...</span>
                  </div>
                ) : "Login"}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantLogin;
