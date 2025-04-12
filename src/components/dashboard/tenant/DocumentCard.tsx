
import { FileText, Download, Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DocumentCardProps {
  id: string;
  name: string;
  type: "identity" | "lease" | "utility" | "other";
  uploadDate: Date | string;
  status: "pending" | "verified" | "rejected";
  fileSize: string;
  onDownload?: (id: string) => void;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const DocumentCard = ({
  id,
  name,
  type,
  uploadDate,
  status,
  fileSize,
  onDownload,
  onView,
  onDelete,
}: DocumentCardProps) => {
  const formattedDate = typeof uploadDate === 'string' 
    ? uploadDate 
    : format(uploadDate, "MMM dd, yyyy");
  
  const getStatusBadge = () => {
    switch (status) {
      case "verified":
        return <Badge variant="default" className="bg-green-600">Verified</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
    }
  };
  
  const getDocumentIcon = () => {
    return <FileText className="h-8 w-8 text-rental-primary" />;
  };
  
  const getDocumentTypeLabel = () => {
    switch (type) {
      case "identity":
        return "Identity Document";
      case "lease":
        return "Lease Agreement";
      case "utility":
        return "Utility Bill";
      default:
        return "Other Document";
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-center gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          {getDocumentIcon()}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-rental-text">{name}</h3>
              <p className="text-xs text-rental-text-light">{getDocumentTypeLabel()}</p>
            </div>
            {getStatusBadge()}
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <div className="text-xs text-rental-text-light">
              <span>Uploaded: {formattedDate}</span>
              <span className="mx-2">•</span>
              <span>{fileSize}</span>
            </div>
            
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onView && onView(id)}
                className="h-8 w-8"
                title="View"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onDownload && onDownload(id)}
                className="h-8 w-8"
                title="Download"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onDelete && onDelete(id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
