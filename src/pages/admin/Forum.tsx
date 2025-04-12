
import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowDown, ArrowUp, MessageSquare, ThumbsUp, MessageCircle, Flag, Shield, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    society_id: "test-society-id",
    reported: false,
    flagged: false
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
    society_id: "test-society-id",
    reported: true,
    flagged: false
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
    society_id: "test-society-id",
    reported: false,
    flagged: true
  }
];

const AdminForumPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Filter forum posts based on search term and tab
  const filteredPosts = mockForumPosts
    .filter(post => {
      if (currentTab === "all") return true;
      if (currentTab === "flagged") return post.flagged;
      if (currentTab === "reported") return post.reported;
      return false;
    })
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

  const handleApprovePost = (postId: string) => {
    // Here we would update the post status via API
    console.log("Approving post:", postId);
  };

  const handleRemovePost = (postId: string) => {
    // Here we would delete the post via API
    console.log("Removing post:", postId);
  };

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-rental-text">Forum Management</h1>
        <p className="text-rental-text-light">
          Monitor and moderate community forum posts
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList>
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="flagged">Flagged</TabsTrigger>
            <TabsTrigger value="reported">Reported</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search forum posts..."
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
      
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium">No posts found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm ? 'Try a different search term' : 'There are no forum posts to moderate at the moment'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className={`shadow-sm ${post.reported ? 'border-red-400' : post.flagged ? 'border-amber-400' : ''}`}>
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
                  
                  <div className="flex items-center gap-2">
                    {post.reported && (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Reported</Badge>
                    )}
                    {post.flagged && (
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Flagged</Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="mt-4 text-xl">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-rental-text-light">{post.content}</p>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(post.reported || post.flagged) && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => handleApprovePost(post.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRemovePost(post.id)}
                  >
                    <Flag className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                  <Button variant="outline" size="sm">
                    <Shield className="h-4 w-4 mr-1" />
                    Details
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

export default AdminForumPage;
