
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, X } from "lucide-react";

// Define the maintenance status type to match Supabase's enum
type MaintenanceStatusType = "pending" | "in_progress" | "completed" | "rejected";

const requestFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  issue_type: z.string().min(1, "Please select an issue type"),
  photos: z.array(z.string()).optional(),
});

type RequestFormValues = z.infer<typeof requestFormSchema>;

const issueTypes = [
  { value: "plumbing", label: "Plumbing Issue" },
  { value: "electrical", label: "Electrical Issue" },
  { value: "appliance", label: "Appliance Repair" },
  { value: "structural", label: "Structural Damage" },
  { value: "pest", label: "Pest Control" },
  { value: "cleaning", label: "Cleaning Service" },
  { value: "security", label: "Security Issue" },
  { value: "other", label: "Other" },
];

const TenantServiceRequestCreate = () => {
  const { user, society, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      title: "",
      description: "",
      issue_type: "",
      photos: [],
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    disabled: isUploading,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;
      
      try {
        setIsUploading(true);
        
        // Check if storage bucket exists, if not create it
        const { data: buckets } = await supabase.storage.listBuckets();
        if (!buckets?.find(bucket => bucket.name === 'maintenance')) {
          await supabase.storage.createBucket('maintenance', {
            public: true,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif'],
            fileSizeLimit: 1024 * 1024 * 5, // 5MB
          });
        }
        
        // Upload each file
        const uploadPromises = acceptedFiles.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `request-${user.id}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
          const filePath = `maintenance/${fileName}`;
          
          const { data, error } = await supabase.storage
            .from('maintenance')
            .upload(filePath, file);
            
          if (error) throw error;
          
          // Get the public URL
          const { data: urlData } = supabase.storage
            .from('maintenance')
            .getPublicUrl(filePath);
            
          return urlData.publicUrl;
        });
        
        // Wait for all uploads to complete
        const urls = await Promise.all(uploadPromises);
        
        // Update state and form
        setUploadedPhotos(prev => [...prev, ...urls]);
        form.setValue('photos', [...uploadedPhotos, ...urls]);
        toast.success('Photos uploaded successfully');
      } catch (error: any) {
        console.error('Error uploading photos:', error);
        toast.error('Failed to upload photos', { description: error.message });
      } finally {
        setIsUploading(false);
      }
    }
  });

  const removePhoto = (url: string) => {
    setUploadedPhotos(prev => prev.filter(photo => photo !== url));
    form.setValue('photos', uploadedPhotos.filter(photo => photo !== url));
  };

  const onSubmit = async (values: RequestFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }
      
      // Prepare the request data with the properly typed status
      const requestData = {
        tenant_id: user.id,
        society_id: society?.id,
        title: values.title,
        description: values.description,
        issue_type: values.issue_type,
        photos: values.photos || [],
        status: "pending" as MaintenanceStatusType, // Use type assertion for the enum value
      };
      
      // Insert into maintenance_requests table
      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert(requestData)
        .select();
        
      if (error) throw error;
      
      toast.success('Service request submitted successfully');
      navigate('/tenant/requests');
    } catch (error: any) {
      console.error('Error submitting service request:', error);
      toast.error('Failed to submit service request', { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="tenant">
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-rental-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="tenant">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-rental-text">
          Create Service Request
        </h1>
        <p className="text-rental-text-light">
          Submit a request for maintenance or repairs
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Service Request Details</CardTitle>
          <CardDescription>
            Provide details about the issue you're experiencing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form id="request-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Brief description of the issue" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Concise summary of the problem (e.g., "Leaking bathroom sink")
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="issue_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the type of issue" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {issueTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Category of the maintenance issue
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please provide detailed information about the issue" 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Include when the issue started, severity, and any relevant details
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="photos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photos</FormLabel>
                    <FormControl>
                      <div 
                        {...getRootProps()} 
                        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
                          isDragActive ? 'border-rental-primary bg-rental-primary/5' : 'border-gray-300 hover:border-rental-primary'
                        }`}
                      >
                        <input {...getInputProps()} />
                        {isUploading ? (
                          <div className="flex flex-col items-center">
                            <Loader2 className="h-8 w-8 animate-spin text-rental-primary mb-2" />
                            <p>Uploading...</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <p>Drag & drop photos here, or click to select files</p>
                            <p className="text-sm text-gray-500 mt-1">
                              (JPEG, PNG or GIF, max 5MB each)
                            </p>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    {uploadedPhotos.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                        {uploadedPhotos.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Uploaded photo ${index + 1}`}
                              className="h-24 w-full object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(url)}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/tenant/requests')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            form="request-form"
            className="bg-rental-primary hover:bg-rental-secondary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </Button>
        </CardFooter>
      </Card>
    </DashboardLayout>
  );
};

export default TenantServiceRequestCreate;
