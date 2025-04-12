
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof formSchema>;

const AdminLogin = () => {
  const navigate = useNavigate();
  const { signIn, userRole, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect based on role
  useEffect(() => {
    if (userRole === 'admin') {
      navigate("/admin/dashboard", { replace: true });
    } else if (userRole === 'tenant') {
      // If a tenant tries to access admin login, redirect them
      navigate("/tenant/dashboard", { replace: true });
    }
  }, [userRole, navigate]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (isLoading) return; // Prevent multiple submissions
    
    setIsLoading(true);
    
    try {
      const result = await signIn(data.email, data.password);

      if (!result.success) {
        throw new Error(result.error || 'Login failed');
      }

      toast.success('Login successful! Redirecting...');
      // The navigation will happen automatically once the auth context updates the userRole
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Login failed", {
        description: error.message || "Please check your credentials and try again"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render form while auth is being checked
  if (authLoading) {
    return (
      <AuthLayout 
        title="Admin Login" 
        subtitle="Manage your society and residents"
        userType="admin"
      >
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-rental-primary" />
          <span className="sr-only">Loading...</span>
        </div>
      </AuthLayout>
    );
  }

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
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Logging in...</span>
              </div>
            ) : "Login"}
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
