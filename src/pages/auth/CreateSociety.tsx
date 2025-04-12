
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import AuthLayout from "@/components/auth/AuthLayout";

const formSchema = z.object({
  name: z.string().min(2, "Society name must be at least 2 characters"),
  address: z.string().min(5, "Please enter a complete address"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(5, "Valid pincode is required"),
  totalFlats: z.string().min(1, "Number of flats is required"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const CreateSociety = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [amenityInput, setAmenityInput] = useState("");
  const [utilityWorkers, setUtilityWorkers] = useState<{ name: string; role: string }[]>([]);
  const [workerName, setWorkerName] = useState("");
  const [workerRole, setWorkerRole] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      totalFlats: "",
      description: "",
    },
  });

  const addAmenity = () => {
    if (amenityInput.trim() !== "" && !amenities.includes(amenityInput.trim())) {
      setAmenities([...amenities, amenityInput.trim()]);
      setAmenityInput("");
    }
  };

  const removeAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  const addUtilityWorker = () => {
    if (workerName.trim() !== "" && workerRole.trim() !== "") {
      setUtilityWorkers([
        ...utilityWorkers,
        { name: workerName.trim(), role: workerRole.trim() },
      ]);
      setWorkerName("");
      setWorkerRole("");
    }
  };

  const removeUtilityWorker = (index: number) => {
    setUtilityWorkers(utilityWorkers.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    const societyData = {
      ...data,
      amenities,
      utilityWorkers,
    };
    
    // This is where you'd connect to Supabase to create society
    // For now, we'll simulate a successful creation
    setTimeout(() => {
      console.log("Society creation data:", societyData);
      toast.success("Society created successfully!");
      navigate("/admin/login");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <AuthLayout 
      title="Create Your Society" 
      subtitle="Set up details for the residential society you manage"
      userType="admin"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Society Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter society name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter society address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PIN Code</FormLabel>
                  <FormControl>
                    <Input placeholder="PIN code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="totalFlats"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Number of Flats</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Brief description of your society" {...field} />
                </FormControl>
                <FormDescription>
                  Provide details about your society that might be helpful for residents.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Amenities Section */}
          <div className="space-y-2">
            <FormLabel>Amenities (Optional)</FormLabel>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="e.g. Swimming Pool"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={addAmenity}
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                    {amenity}
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => removeAmenity(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          {/* Utility Workers Section */}
          <div className="space-y-2">
            <FormLabel>Utility Workers (Optional)</FormLabel>
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <FormLabel>Name</FormLabel>
                    <Input
                      placeholder="Worker name"
                      value={workerName}
                      onChange={(e) => setWorkerName(e.target.value)}
                    />
                  </div>
                  <div>
                    <FormLabel>Role</FormLabel>
                    <Input
                      placeholder="e.g. Security Guard"
                      value={workerRole}
                      onChange={(e) => setWorkerRole(e.target.value)}
                    />
                  </div>
                </div>
                <Button 
                  type="button" 
                  onClick={addUtilityWorker}
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Utility Worker
                </Button>
                
                {utilityWorkers.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {utilityWorkers.map((worker, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                        <div>
                          <p className="font-medium">{worker.name}</p>
                          <p className="text-sm text-gray-500">{worker.role}</p>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeUtilityWorker(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-rental-primary hover:bg-rental-secondary"
            disabled={isLoading}
          >
            {isLoading ? "Creating Society..." : "Create Society"}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default CreateSociety;
