
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { useSocietyCreation } from "@/hooks/useSocietyCreation";
import { AmenitiesSection } from "./AmenitiesSection";
import { UtilityWorkersSection } from "./UtilityWorkersSection";

export const societyFormSchema = z.object({
  name: z.string().min(2, "Society name must be at least 2 characters"),
  address: z.string().min(5, "Please enter a complete address"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(5, "Valid pincode is required"),
  totalFlats: z.string().min(1, "Number of flats is required"),
  description: z.string().optional(),
});

export type SocietyFormData = z.infer<typeof societyFormSchema>;

export const SocietyForm = () => {
  const { 
    isLoading, 
    amenities,
    setAmenities,
    utilityWorkers,
    setUtilityWorkers,
    handleSubmitSociety 
  } = useSocietyCreation();

  const form = useForm<SocietyFormData>({
    resolver: zodResolver(societyFormSchema),
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

  const onSubmit = (data: SocietyFormData) => {
    handleSubmitSociety(data);
  };

  return (
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
        
        <AmenitiesSection 
          amenities={amenities} 
          setAmenities={setAmenities} 
        />
        
        <UtilityWorkersSection 
          utilityWorkers={utilityWorkers} 
          setUtilityWorkers={setUtilityWorkers} 
        />
        
        <Button 
          type="submit" 
          className="w-full bg-rental-primary hover:bg-rental-secondary"
          disabled={isLoading}
        >
          {isLoading ? "Creating Society..." : "Create Society"}
        </Button>
      </form>
    </Form>
  );
};
