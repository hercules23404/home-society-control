
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

const noticeFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  notice_type: z.string().min(1, "Please select a notice type"),
  is_pinned: z.boolean().default(false),
});

type NoticeFormValues = z.infer<typeof noticeFormSchema>;

const noticeTypes = [
  { value: "general", label: "General" },
  { value: "maintenance", label: "Maintenance" },
  { value: "events", label: "Events" },
  { value: "emergency", label: "Emergency" },
];

const AdminCreateNotice = () => {
  const { user, society, loading } = useAdminAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<NoticeFormValues>({
    resolver: zodResolver(noticeFormSchema),
    defaultValues: {
      title: "",
      content: "",
      notice_type: "",
      is_pinned: false,
    },
  });

  const onSubmit = async (values: NoticeFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }
      
      // Prepare the notice data
      const noticeData = {
        society_id: society?.id,
        title: values.title,
        content: values.content,
        notice_type: values.notice_type,
        is_pinned: values.is_pinned,
        is_admin_post: true,
        user_id: user.id,
      };
      
      // Insert into forum_posts table
      const { data, error } = await supabase
        .from('forum_posts')
        .insert(noticeData)
        .select();
        
      if (error) throw error;
      
      toast.success('Notice published successfully');
      navigate('/admin/notices');
    } catch (error: any) {
      console.error('Error publishing notice:', error);
      toast.error('Failed to publish notice', { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-rental-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-rental-text">
          Create Notice
        </h1>
        <p className="text-rental-text-light">
          Post a new notice for society residents
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Notice Details</CardTitle>
          <CardDescription>
            Provide information for the notice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form id="notice-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notice Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter the notice title" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      A clear title for the notice
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notice_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notice Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the type of notice" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {noticeTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Type of notice to determine its priority and appearance
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notice Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter the notice details" 
                        className="min-h-[180px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Detailed information for the notice
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="is_pinned"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Pin Notice</FormLabel>
                      <FormDescription>
                        Pinned notices will appear at the top of the notice board
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/notices')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            form="notice-form"
            className="bg-rental-primary hover:bg-rental-secondary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              'Publish Notice'
            )}
          </Button>
        </CardFooter>
      </Card>
    </DashboardLayout>
  );
};

export default AdminCreateNotice;
