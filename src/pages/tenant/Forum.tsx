
import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, ArrowDown, ArrowUp, MessageSquare, User, ThumbsUp, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Mock forum data
const mockForumPosts = [
  {
    id: "post-1",
    user_id: "user-2",
    user_name: "Amit Sharma",
    user_avatar: null,
    title: "Weekend Cleaning Drive",
    content: "Hello neighbors! I'm organizing a cleaning drive this weekend to spruce up our garden area. Anyone interested in joining please comment below. We'll start at 9 AM on Saturday.",
    date: "2023-12-15T08:30:00",
    likes: 12,
    comments: 8,
    society_id: "test-society-id"
  },
  {
    id: "post-2",
    user_id: "test-tenant-id",
    user_name: "Priya Singh",
    user_avatar: null,
    title: "Lost cat - please help",
    content: "My orange tabby cat, Leo, has been missing since yesterday evening. He was last seen near building C. If anyone spots him, please contact me immediately. He has a blue collar with my number.",
    date: "2023-12-17T14:45:00",
    likes: 5,
    comments: 15,
    society_id: "test-society-id"
  },
  {
    id: "post-3",
    user_id: "user-3",
    user_name: "Ravi Kumar",
    user_avatar: null,
    title: "Request to fix playground swing",
    content: "The swing in the children's playground has been broken for two weeks now. It's becoming a safety hazard. I've reported it to the maintenance staff but there's been no action. Can the society please look into this urgently?",
    date: "2023-12-18T09:15:00",
    likes: 24,
    comments: 6,
    society_id: "test-society-id"
  }
];

const ForumPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  // Filter forum posts based on search term
  const filteredPosts = mockForumPosts
    .filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.user_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });

  const handleCreatePost = () => {
    // Here we would normally submit the new post to the backend
    console.log("Creating new post:", { title: newPostTitle, content: newPostContent });
    setIsCreateDialogOpen(false);
    setNewPostTitle("");
    setNewPostContent("");
    // In a real app, you would add the new post to the list after API success
  };

  return (
    <DashboardLayout role="tenant">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-rental-text">Community Forum</h1>
        <p className="text-rental-text-light">
          Connect with neighbors and discuss society matters
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search forum posts..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="gap-1"
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
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-rental-primary hover:bg-rental-secondary">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create New Forum Post</DialogTitle>
                <DialogDescription>
                  Share your thoughts, questions, or announcements with your society members.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="post-title">Title</Label>
                  <Input
                    id="post-title"
                    placeholder="Enter a title for your post"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="post-content">Content</Label>
                  <Textarea
                    id="post-content"
                    placeholder="Write your post content here..."
                    rows={5}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button 
                  className="bg-rental-primary hover:bg-rental-secondary"
                  onClick={handleCreatePost}
                  disabled={!newPostTitle.trim() || !newPostContent.trim()}
                >
                  Post
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium">No posts found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm ? 'Try a different search term' : 'Be the first to create a post!'}
          </p>
          <Button 
            className="mt-4 bg-rental-primary hover:bg-rental-secondary"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            Create First Post
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {post.user_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                      {post.user_avatar && <AvatarImage src={post.user_avatar} />}
                    </Avatar>
                    <div>
                      <p className="font-medium">{post.user_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(post.date), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                  
                  {post.user_id === user.id && (
                    <Badge variant="outline">Your Post</Badge>
                  )}
                </div>
                <CardTitle className="mt-4 text-xl">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-rental-text-light">{post.content}</p>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  View Discussion
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ForumPage;
