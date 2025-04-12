
import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  PlusCircle,
  FileText,
  Download,
  Eye,
  Calendar,
  Trash2,
  Upload,
  FileSpreadsheet,
  FileImage,
  File,
  Filter,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

// Mock data for documents
const mockDocuments = [
  {
    id: "1",
    name: "Society Bylaws",
    type: "pdf",
    category: "legal",
    uploadedBy: "Admin",
    size: "2.4 MB",
    uploadedOn: new Date(2025, 1, 15),
    sharedWith: "all",
  },
  {
    id: "2",
    name: "Monthly Maintenance Bill - March 2025",
    type: "pdf",
    category: "financial",
    uploadedBy: "Admin",
    size: "1.2 MB",
    uploadedOn: new Date(2025, 3, 5),
    sharedWith: "all",
  },
  {
    id: "3",
    name: "Annual General Meeting Minutes",
    type: "doc",
    category: "meeting",
    uploadedBy: "Secretary",
    size: "750 KB",
    uploadedOn: new Date(2025, 2, 20),
    sharedWith: "all",
  },
  {
    id: "4",
    name: "Society Audit Report 2024-25",
    type: "xlsx",
    category: "financial",
    uploadedBy: "Admin",
    size: "3.8 MB",
    uploadedOn: new Date(2025, 3, 10),
    sharedWith: "committee",
  },
  {
    id: "5",
    name: "Property Tax Receipt",
    type: "pdf",
    category: "legal",
    uploadedBy: "Admin",
    size: "1.5 MB",
    uploadedOn: new Date(2025, 2, 28),
    sharedWith: "committee",
  },
  {
    id: "6",
    name: "Society Event Photos",
    type: "zip",
    category: "other",
    uploadedBy: "Cultural Secretary",
    size: "28.5 MB",
    uploadedOn: new Date(2025, 3, 2),
    sharedWith: "all",
  },
];

const DocumentsPage = () => {
  const [documents] = useState(mockDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");

  const filteredDocuments = documents
    .filter(document => {
      if (currentTab === "all") return true;
      return document.category === currentTab;
    })
    .filter(document => 
      document.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      document.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <File className="h-5 w-5 text-red-500" />;
      case "doc":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "xlsx":
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      case "zip":
        return <FileImage className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "legal":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Legal</Badge>;
      case "financial":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Financial</Badge>;
      case "meeting":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Meeting</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">{category}</Badge>;
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-rental-text">Documents</h1>
        <p className="text-rental-text-light">
          Manage and share important society documents
        </p>
      </div>

      <Card className="shadow-sm mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Document Storage Overview</CardTitle>
          <CardDescription>
            Quick summary of your document repository
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-md">
              <FileText className="h-5 w-5" />
              <div>
                <div className="text-sm font-medium">Total Documents</div>
                <div className="text-2xl font-bold">{documents.length}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-md">
              <File className="h-5 w-5" />
              <div>
                <div className="text-sm font-medium">Legal Documents</div>
                <div className="text-2xl font-bold">
                  {documents.filter(doc => doc.category === "legal").length}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-md">
              <FileSpreadsheet className="h-5 w-5" />
              <div>
                <div className="text-sm font-medium">Financial Documents</div>
                <div className="text-2xl font-bold">
                  {documents.filter(doc => doc.category === "financial").length}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-6">
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="legal">Legal</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="meeting">Meeting</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button className="bg-rental-primary hover:bg-rental-secondary">
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search documents..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>
      
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getDocumentIcon(document.type)}
                      <span className="font-medium">{document.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getCategoryBadge(document.category)}</TableCell>
                  <TableCell>{document.uploadedBy}</TableCell>
                  <TableCell>{format(document.uploadedOn, "MMM d, yyyy")}</TableCell>
                  <TableCell>{document.size}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="text-rental-primary hover:text-rental-secondary">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-rental-primary hover:text-rental-secondary">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default DocumentsPage;
