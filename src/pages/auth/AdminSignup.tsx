
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  designation: z.string().min(2, "Designation is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

const AdminSignup = () => {
  const navigate = useNavigate();
  const { userRole, signUp, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect based on role
  useEffect(() => {
    if (userRole === 'admin') {
      navigate("/admin/dashboard", { replace: true });
    } else if (userRole === 'tenant') {
      navigate("/tenant/dashboard", { replace: true });
    }
  }, [userRole, navigate]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      designation: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (isLoading) return; // Prevent multiple submissions
    
    setIsLoading(true);
    
    try {
      // Step 1: Register the user in Supabase Auth
      const { success, error, userId } = await signUp(data.email, data.password, {
        full_name: data.name,
        phone: data.phone,
        designation: data.designation
      });

      if (!success || !userId) {
        throw new Error(error || "User creation failed");
      }

      console.log("Auth user created successfully:", userId);

      // Step 2: Update the user's profile with additional information
      const nameParts = data.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName, 
          phone: data.phone,
          role: 'admin'
        })
        .eq('id', userId);

      if (profileError) {
        console.error("Profile update error:", profileError);
        throw profileError;
      }

      console.log("Profile updated successfully");
      toast.success("Registration successful!");
      
      // Navigate to society creation with user data
      navigate("/admin/create-society", { 
        state: { 
          userId,
          designation: data.designation
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

  // Don't render form while auth is being checked
  if (authLoading) {
    return (
      <AuthLayout 
        title="Create Admin Account" 
        subtitle="Set up your account to manage your society"
        userType="admin"
      >
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-rental-primary" />
          <span className="sr-only">Loading authentication...</span>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Create Admin Account" 
      subtitle="Set up your account to manage your society"
      userType="admin"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Society Secretary" {...field} />
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
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Creating Account...</span>
              </div>
            ) : "Sign Up"}
          </Button>
        </form>
      </Form>
      
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
