
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import AuthLayout from "@/components/auth/AuthLayout";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

const AdminSignup = () => {
  const navigate = useNavigate();
  const { userRole, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect based on role - only if not in the process of loading or submitting
  useEffect(() => {
    if (!isLoading && !authLoading) {
      if (userRole === 'admin') {
        navigate("/admin/dashboard", { replace: true });
      } else if (userRole === 'tenant') {
        navigate("/tenant/dashboard", { replace: true });
      }
    }
  }, [userRole, navigate, isLoading, authLoading]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (isLoading) return; // Prevent multiple submissions
    
    setIsLoading(true);
    
    try {
      console.log("Starting admin registration process...");
      
      // Step 1: Register the user in Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone,
            role: 'admin'
          }
        }
      });

      if (signUpError || !authData.user) {
        throw new Error(signUpError?.message || "User creation failed");
      }

      const userId = authData.user.id;
      console.log("Auth user created successfully:", userId);
      
      // Step 2: Manually create profile if the database trigger didn't work
      try {
        // Short delay to give the trigger time to work
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if profile exists (it should be created by the database trigger)
        const { data: profileData, error: profileCheckError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .single();
        
        if (profileCheckError || !profileData) {
          console.log("Profile not found, creating manually:", profileCheckError);
          
          // Create profile manually as a fallback
          const { error: createProfileError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: data.email,
              first_name: data.firstName,
              last_name: data.lastName,
              phone: data.phone,
              role: 'admin'
            });
          
          if (createProfileError) {
            console.error("Error creating profile manually:", createProfileError);
            // Continue anyway - we'll try again on the next page if needed
          } else {
            console.log("Profile created manually successfully");
          }
        } else {
          console.log("Profile already exists:", profileData.id);
        }
      } catch (profileError) {
        console.error("Error handling profile creation:", profileError);
        // Continue anyway - we'll try to recover on the next page
      }
      
      toast.success("Registration successful!");
      
      // Navigate to society creation with user data
      navigate("/admin/create-society", { 
        state: { 
          userId,
          fromSignup: true // Flag to indicate this is coming from signup flow
        },
        replace: true
      });
      
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error("Registration failed", {
        description: error.message || "Please check your information and try again"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create Admin Account" 
      subtitle="Set up your account to manage your society"
      userType="admin"
    >
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 flex items-center text-sm text-muted-foreground gap-1"
        onClick={() => navigate('/admin-auth')}
      >
        <ChevronLeft className="h-4 w-4" />
        Back to options
      </Button>
      
      {/* Show spinner only when submitting the form, not during auth check */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-rental-primary" />
          <span className="sr-only">Creating account...</span>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" {...field} />
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
                    <Input placeholder="Enter your phone number" {...field} />
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
                        placeholder="••••••••"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
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
                        placeholder="••••••••"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
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
            
            <Button 
              type="submit" 
              className="w-full bg-rental-primary hover:bg-rental-secondary"
              disabled={isLoading}
            >
              Sign Up & Continue to Society Setup
            </Button>
          </form>
        </Form>
      )}
      
      <div className="mt-4 text-center">
        <p className="text-sm text-rental-text-light">
          Already have an account?{" "}
          <Link to="/admin/login" className="text-rental-primary font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default AdminSignup;
