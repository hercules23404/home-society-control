
import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, ArrowDown, ArrowUp, FileText, Download, Eye, Trash2 } from "lucide-react";
import DocumentCard from "@/components/dashboard/tenant/DocumentCard";
import { mockDocuments } from "@/utils/mockData";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DocumentsPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [newDocumentType, setNewDocumentType] = useState("");

  // Filter documents for the current tenant
  const tenantDocuments = mockDocuments.filter(doc => 
    doc.tenant_id === user?.id
  );

  // Further filter based on search term and tab
  const filteredDocuments = tenantDocuments
    .filter(doc => {
      if (currentTab === "all") return true;
      return doc.type === currentTab;
    })
    .filter(doc => 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      doc.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime();
      } else {
        return new Date(a.uploaded_at).getTime() - new Date(b.uploaded_at).getTime();
      }
    });

  // Get unique document types
  const documentTypes = ["identity", "address", "income", "rental", "other"];

  const handleUploadDocument = () => {
    // Here we would normally upload the document
    console.log("Uploading new document of type:", newDocumentType);
    setIsUploadDialogOpen(false);
    setNewDocumentType("");
    // In a real app, you would add the new document to the list after upload success
  };

  return (
    <DashboardLayout role="tenant">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-rental-text">My Documents</h1>
        <p className="text-rental-text-light">
          Manage your personal and rental documents
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {documentTypes.map(type => (
              <TabsTrigger key={type} value={type} className="capitalize">
                {type}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-rental-primary hover:bg-rental-secondary">
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
              <DialogDescription>
                Upload important documents for your tenant profile.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="document-type">Document Type</Label>
                <Select
                  value={newDocumentType}
                  onValueChange={setNewDocumentType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map(type => (
                      <SelectItem key={type} value={type} className="capitalize">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="document-file">Document File</Label>
                <Input
                  id="document-file"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>Cancel</Button>
              <Button 
                className="bg-rental-primary hover:bg-rental-secondary"
                onClick={handleUploadDocument}
                disabled={!newDocumentType}
              >
                Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search documents..."
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
      
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium">No documents found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm ? 'Try a different search term' : 'Upload your first document to get started'}
          </p>
          <Button 
            className="mt-4 bg-rental-primary hover:bg-rental-secondary"
            onClick={() => setIsUploadDialogOpen(true)}
          >
            Upload Document
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <DocumentCard
              key={document.id}
              id={document.id}
              name={document.name}
              type={document.type}
              uploaded_at={document.uploaded_at}
              file_url={document.file_url}
              status={document.status}
              comment={document.comment}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default DocumentsPage;
