
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { toast } from 'sonner';
import { Plus, Loader2, Eye, EyeOff } from 'lucide-react';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  flatNumber: z.string().min(1, 'Flat number is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof formSchema>;

const AddTenants = () => {
  const { user, society } = useAdminAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      flatNumber: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!user || !society) {
      toast.error('Admin information not found');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Step 1: Create a new user in auth system
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            role: 'tenant',
            full_name: data.fullName,
            flat_number: data.flatNumber,
            phone: data.phone,
          }
        }
      });
      
      if (signUpError || !authData?.user) {
        throw new Error(signUpError?.message || 'Failed to create tenant account');
      }
      
      // Extract first and last name
      const nameParts = data.fullName.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      // Step 2: Update the tenant's profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          flat_number: data.flatNumber,
          phone: data.phone,
          society_id: society.id,
          role: 'tenant',
        })
        .eq('id', authData.user.id);
        
      if (profileError) {
        console.error('Error updating tenant profile:', profileError);
        throw new Error('Failed to set up tenant profile');
      }
      
      // Step 3: Create entry in tenants table
      const { error: tenantError } = await supabase
        .from('tenants')
        .insert({
          user_id: authData.user.id,
          society_id: society.id,
          flat_number: data.flatNumber,
        });
        
      if (tenantError) {
        console.error('Error creating tenant record:', tenantError);
        throw new Error('Failed to create tenant record');
      }
      
      toast.success('Tenant added successfully!', {
        description: `${data.fullName} has been added as a tenant to ${society.name}`,
      });
      
      // Reset the form
      form.reset({
        fullName: '',
        flatNumber: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
      });
      
    } catch (error: any) {
      console.error('Error adding tenant:', error);
      toast.error('Failed to add tenant', {
        description: error.message || 'Please check the provided information and try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-rental-text">Add New Tenant</h1>
        <p className="text-rental-text-light">Create tenant accounts for residents in your society</p>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Plus className="h-5 w-5" />
            Register New Tenant
          </CardTitle>
          <CardDescription>
            Create login credentials for a new tenant in your society
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-5 pb-5">
                <h3 className="font-semibold text-rental-primary">Tenant Information</h3>
                <Separator />
                
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter tenant's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="flatNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Flat Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. A-101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter tenant's phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-5">
                <h3 className="font-semibold text-rental-primary">Account Credentials</h3>
                <Separator />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="tenant@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password for the tenant"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">
                              {showPassword ? "Hide password" : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm the password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">
                              {showConfirmPassword ? "Hide password" : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-rental-primary hover:bg-rental-secondary mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Tenant Account...
                  </>
                ) : (
                  <>Add Tenant</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AddTenants;
