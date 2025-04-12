
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useSocietySelection } from '@/hooks/useSocietySelection';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Loader2 } from 'lucide-react';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  societyId: z.string().min(1, 'Please select a society')
});

const TenantSignup = () => {
  const { societies, fetchSocieties, loading: societiesLoading } = useSocietySelection();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { signUp, userRole } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (userRole === 'tenant') {
      navigate('/tenant/dashboard');
    }
  }, [userRole, navigate]);

  const { 
    register, 
    control, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(signupSchema)
  });

  useEffect(() => {
    const loadSocieties = async () => {
      await fetchSocieties();
    };
    
    loadSocieties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log('Societies in component:', societies);
  }, [societies]);

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    try {
      setIsSubmitting(true);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password
      });

      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error("User creation failed");
      }
      
      setUserId(authData.user.id);

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          role: 'tenant'
        })
        .eq('id', authData.user.id);

      if (profileError) throw profileError;

      const { error: tenantError } = await supabase
        .from('tenants')
        .insert({
          user_id: authData.user.id,
          society_id: data.societyId,
          flat_number: '' // Will be updated later
        });

      if (tenantError) throw tenantError;

      toast.success('Account created successfully');
    } catch (error: any) {
      toast.error('Signup failed', {
        description: error.message
      });
      console.error("Signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 right-4"
          onClick={() => navigate('/')}
        >
          <Home className="h-6 w-6" />
          <span className="sr-only">Return to Home</span>
        </Button>

        <CardHeader>
          <CardTitle>Tenant Signup</CardTitle>
          <CardDescription>
            Create your tenant account and join your society
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>First Name</Label>
              <Input 
                {...register('firstName')}
                placeholder="Enter your first name" 
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message?.toString()}
                </p>
              )}
            </div>

            <div>
              <Label>Last Name</Label>
              <Input 
                {...register('lastName')}
                placeholder="Enter your last name" 
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName.message?.toString()}
                </p>
              )}
            </div>

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

            <div>
              <Label>Select Society</Label>
              <Controller
                name="societyId"
                control={control}
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={societiesLoading ? "Loading societies..." : "Choose your society"} />
                    </SelectTrigger>
                    <SelectContent>
                      {societiesLoading ? (
                        <div className="flex items-center justify-center p-2">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span>Loading...</span>
                        </div>
                      ) : societies && societies.length > 0 ? (
                        societies.map((society) => (
                          <SelectItem 
                            key={society.id} 
                            value={society.id}
                          >
                            {society.name} - {society.city}, {society.state}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No societies available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.societyId && (
                <p className="text-red-500 text-sm">
                  {errors.societyId.message?.toString()}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="text-center">
              <p>
                Already have an account? {' '}
                <Link 
                  to="/tenant/login" 
                  className="text-blue-600 hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantSignup;
