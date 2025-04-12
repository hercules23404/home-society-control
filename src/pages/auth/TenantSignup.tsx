
import React, { useState, useEffect } from 'react';
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

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  societyId: z.string().min(1, 'Please select a society')
});

const TenantSignup = () => {
  const { societies, fetchSocieties } = useSocietySelection();
  const navigate = useNavigate();

  const { 
    register, 
    control, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(signupSchema)
  });

  useEffect(() => {
    fetchSocieties();
  }, []);

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    try {
      // Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password
      });

      if (authError) throw authError;

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          role: 'tenant'
        })
        .eq('id', authData.user?.id);

      if (profileError) throw profileError;

      // Assign to society
      const { error: tenantError } = await supabase
        .from('tenants')
        .insert({
          user_id: authData.user?.id,
          society_id: data.societyId,
          flat_number: '' // Will be updated later
        });

      if (tenantError) throw tenantError;

      toast.success('Account created successfully');
      navigate('/tenant/dashboard');
    } catch (error: any) {
      toast.error('Signup failed', {
        description: error.message
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
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
                  {errors.firstName.message}
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
                  {errors.lastName.message}
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
                  {errors.email.message}
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
                  {errors.password.message}
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
                      <SelectValue placeholder="Choose your society" />
                    </SelectTrigger>
                    <SelectContent>
                      {societies.map((society) => (
                        <SelectItem 
                          key={society.id} 
                          value={society.id}
                        >
                          {society.name} - {society.city}, {society.state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.societyId && (
                <p className="text-red-500 text-sm">
                  {errors.societyId.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Create Account
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
