
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  PlusCircle, 
  Calendar, 
  Users, 
  Info, 
  Bell,
  Trash2,
  Edit,
  Loader2,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Notice = {
  id: string;
  title: string;
  content: string;
  notice_type: 'general' | 'maintenance' | 'events' | 'emergency';
  is_pinned: boolean;
  created_at: string;
  updated_at?: string;
  user_id: string;
  society_id: string;
  is_admin_post: boolean;
};

const NoticesPage = () => {
  const { user, society } = useAdminAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [noticeType, setNoticeType] = useState<'general' | 'maintenance' | 'events' | 'emergency'>('general');
  const [isPinned, setIsPinned] = useState(false);
  
  const queryClient = useQueryClient();

  // Fetch notices
  const { data: notices = [], isLoading, error } = useQuery({
    queryKey: ['notices', society?.id],
    queryFn: async () => {
      if (!society?.id) return [];
      
      const { data, error } = await supabase
        .from('forum_posts')
        .select('*')
        .eq('society_id', society.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        toast.error('Failed to fetch notices');
        throw error;
      }
      
      return data as Notice[];
    },
    enabled: !!society?.id,
  });

  // Create notice mutation
  const createNoticeMutation = useMutation({
    mutationFn: async (newNotice: Omit<Notice, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('forum_posts')
        .insert(newNotice)
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Notice created successfully!');
      setIsCreateDialogOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['notices', society?.id] });
    },
    onError: (error) => {
      toast.error('Failed to create notice: ' + error.message);
    }
  });

  // Update notice mutation
  const updateNoticeMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<Notice> }) => {
      const { data, error } = await supabase
        .from('forum_posts')
        .update(updates)
        .eq('id', id)
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Notice updated successfully!');
      setIsEditDialogOpen(false);
      setEditingNotice(null);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['notices', society?.id] });
    },
    onError: (error) => {
      toast.error('Failed to update notice: ' + error.message);
    }
  });

  // Delete notice mutation
  const deleteNoticeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('forum_posts')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Notice deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['notices', society?.id] });
    },
    onError: (error) => {
      toast.error('Failed to delete notice: ' + error.message);
    }
  });

  // Handle form submission for create
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      toast.error('Please fill all required fields');
      return;
    }
    
    if (!user?.id || !society?.id) {
      toast.error('Authentication error');
      return;
    }
    
    const newNotice = {
      title,
      content,
      notice_type: noticeType,
      is_pinned: isPinned,
      user_id: user.id,
      society_id: society.id,
      is_admin_post: true,
    };
    
    createNoticeMutation.mutate(newNotice);
  };

  // Handle form submission for edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingNotice) return;
    
    if (!title || !content) {
      toast.error('Please fill all required fields');
      return;
    }
    
    updateNoticeMutation.mutate({
      id: editingNotice.id,
      updates: {
        title,
        content,
        notice_type: noticeType,
        is_pinned: isPinned,
      }
    });
  };

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setTitle(notice.title);
    setContent(notice.content);
    setNoticeType(notice.notice_type);
    setIsPinned(notice.is_pinned);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this notice?')) {
      deleteNoticeMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setNoticeType("general");
    setIsPinned(false);
  };

  // Filter notices based on search and tab
  const filteredNotices = notices
    .filter(notice => {
      if (currentTab === "all") return true;
      return notice.notice_type === currentTab;
    })
    .filter(notice => 
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      notice.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
    });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "maintenance":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Maintenance</Badge>;
      case "events":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Events</Badge>;
      case "emergency":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Emergency</Badge>;
      default:
        return <Badge variant="outline" className="bg-green-100 text-green-800">General</Badge>;
    }
  };

  if (error) {
    return (
      <DashboardLayout role="admin">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-red-500">Error loading notices</h2>
          <p>Please try refreshing the page</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-rental-text">Notices</h1>
        <p className="text-rental-text-light">
          Create and manage notices for your society
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-rental-primary hover:bg-rental-secondary">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Notice
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create New Notice</DialogTitle>
              <DialogDescription>
                Enter the details for the new notice. This will be visible to all tenants in your society.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title" className="text-left">Title</Label>
                  <Input 
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter notice title"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type" className="text-left">Type</Label>
                  <Select
                    value={noticeType}
                    onValueChange={(value) => setNoticeType(value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select notice type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="events">Events</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content" className="text-left">Content</Label>
                  <Textarea 
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter notice content"
                    required
                    rows={5}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPinned"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="rounded border-gray-300 text-rental-primary focus:ring-rental-primary"
                  />
                  <Label htmlFor="isPinned">Pin this notice</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-rental-primary hover:bg-rental-secondary" disabled={createNoticeMutation.isPending}>
                  {createNoticeMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Notice'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Edit Notice</DialogTitle>
              <DialogDescription>
                Update the details of this notice.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title" className="text-left">Title</Label>
                  <Input 
                    id="edit-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter notice title"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-type" className="text-left">Type</Label>
                  <Select
                    value={noticeType}
                    onValueChange={(value) => setNoticeType(value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select notice type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="events">Events</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-content" className="text-left">Content</Label>
                  <Textarea 
                    id="edit-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter notice content"
                    required
                    rows={5}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-isPinned"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="rounded border-gray-300 text-rental-primary focus:ring-rental-primary"
                  />
                  <Label htmlFor="edit-isPinned">Pin this notice</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-rental-primary hover:bg-rental-secondary" disabled={updateNoticeMutation.isPending}>
                  {updateNoticeMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Notice'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search notices..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          className="ml-2 gap-1"
          onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
        >
          {sortOrder === 'newest' ? (
            <>
              <ArrowDown className="h-4 w-4" />
              Newest
            </>
          ) : (
            <>
              <ArrowUp className="h-4 w-4" />
              Oldest
            </>
          )}
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-rental-primary" />
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium">No notices found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm ? 'Try a different search term' : 'Get started by creating a new notice'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNotices.map((notice) => (
            <Card key={notice.id} className={`shadow-sm ${notice.is_pinned ? 'border-rental-primary' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-xl text-rental-text">
                    {notice.is_pinned && <Badge className="bg-rental-primary mr-2">Pinned</Badge>}
                    {notice.title}
                  </CardTitle>
                  {getCategoryBadge(notice.notice_type)}
                </div>
                <CardDescription className="flex items-center mt-1">
                  <Calendar className="h-3 w-3 mr-1" /> 
                  Published on {format(new Date(notice.created_at), "MMM d, yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-rental-text-light">{notice.content}</p>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-end">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(notice)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(notice.id)}
                    disabled={deleteNoticeMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default NoticesPage;
