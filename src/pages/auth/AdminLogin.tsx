
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof formSchema>;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      // Step 1: Sign in with Supabase Auth
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;
      
      // Step 2: Use our RPC function for role check instead of direct query
      // This uses the security definer function we just created
      const { data: userRole, error: roleError } = await supabase
        .rpc('get_user_role');
        
      if (roleError) throw roleError;
      
      if (userRole !== 'admin') {
        throw new Error('This account does not have admin privileges');
      }

      // Step 3: Check if user is associated with a society
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', authData.user.id);

      if (adminError) throw adminError;

      toast.success("Login successful!");
      
      if (adminData && adminData.length > 0) {
        // Admin is associated with a society, redirect to dashboard
        navigate("/admin/dashboard");
      } else {
        // Admin needs to create or join a society
        navigate("/admin/create-society");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Login failed", {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Admin Login" 
      subtitle="Manage your society and residents"
      userType="admin"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          
          <Button 
            type="submit" 
            className="w-full bg-rental-primary hover:bg-rental-secondary"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-rental-text-light">
          Don't have an account?{" "}
          <Link to="/admin/signup" className="text-rental-primary font-medium hover:underline">
            Sign up as Admin
          </Link>
        </p>
      </div>
      
      {/* Test User Credentials */}
      <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-100">
        <h3 className="text-sm font-medium mb-2">Test User:</h3>
        <div className="text-xs text-gray-600 space-y-1">
          <p>Email: admin@example.com</p>
          <p>Password: password123</p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default AdminLogin;
