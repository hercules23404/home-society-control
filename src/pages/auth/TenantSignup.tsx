
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AuthLayout from "@/components/auth/AuthLayout";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  flatNumber: z.string().min(1, "Flat number is required"),
  societyId: z.string().min(1, "Please select your society"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

// Mock data for societies
const mockSocieties = [
  { id: "1", name: "Green Valley Apartments" },
  { id: "2", name: "Sunshine Residency" },
  { id: "3", name: "Blue Mountain Society" },
  { id: "4", name: "Royal Palm Enclave" },
];

const TenantSignup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      flatNumber: "",
      societyId: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (step === 1) {
      setStep(2);
      return;
    }

    setIsLoading(true);
    
    // This is where you'd connect to Supabase for registration
    // For now, we'll simulate a successful registration
    setTimeout(() => {
      console.log("Registration details:", data);
      toast.success("Registration successful! Please log in.");
      navigate("/tenant/login");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <AuthLayout 
      title="Create Tenant Account" 
      subtitle="Get access to your society's services"
      userType="tenant"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {step === 1 ? (
            <>
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
            </>
          ) : (
            <>
              <FormField
                control={form.control}
                name="flatNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flat/Unit Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. A-101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="societyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Society</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your society" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockSocieties.map((society) => (
                          <SelectItem key={society.id} value={society.id}>
                            {society.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the society you belong to.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-rental-primary hover:bg-rental-secondary"
            disabled={isLoading}
          >
            {step === 1 ? "Continue" : isLoading ? "Creating Account..." : "Complete My Profile Setup"}
          </Button>
          
          {step === 2 && (
            <Button 
              type="button" 
              variant="ghost" 
              className="w-full mt-2"
              onClick={() => setStep(1)}
            >
              Back to Previous Step
            </Button>
          )}
        </form>
      </Form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-rental-text-light">
          Already have an account?{" "}
          <Link to="/tenant/login" className="text-rental-primary font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default TenantSignup;
