
import { useState } from "react";
import { format } from "date-fns";
import { CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface RequestCardProps {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "resolved" | "rejected";
  date: Date | string;
  category: string;
  assignedTo?: string;
  onViewClick?: (id: string) => void;
}

const RequestCard = ({
  id,
  title,
  description,
  status,
  date,
  category,
  assignedTo,
  onViewClick,
}: RequestCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const formattedDate = typeof date === 'string' ? date : format(date, "MMM dd, yyyy");
  
  const getStatusIcon = () => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case "resolved":
        return "Resolved";
      case "rejected":
        return "Rejected";
      case "in-progress":
        return "In Progress";
      default:
        return "Pending";
    }
  };
  
  const getStatusStyles = () => {
    switch (status) {
      case "resolved":
        return "bg-green-50 border-green-100";
      case "rejected":
        return "bg-red-50 border-red-100";
      case "in-progress":
        return "bg-amber-50 border-amber-100";
      default:
        return "bg-blue-50 border-blue-100";
    }
  };

  return (
    <div className={cn("border rounded-lg overflow-hidden", getStatusStyles())}>
      <div 
        className="p-4 cursor-pointer flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          {getStatusIcon()}
          <div className="ml-3">
            <h3 className="font-medium text-rental-text">{title}</h3>
            <span className="text-xs text-rental-text-light">{formattedDate}</span>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-white">
            {getStatusText()}
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4">
          <p className="text-sm text-rental-text-light mb-3">{description}</p>
          
          <div className="grid grid-cols-2 gap-2 text-xs text-rental-text-light mb-3">
            <div>
              <span className="font-medium">Category:</span> {category}
            </div>
            {assignedTo && (
              <div>
                <span className="font-medium">Assigned To:</span> {assignedTo}
              </div>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewClick && onViewClick(id)}
            className="w-full justify-center"
          >
            View Details <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default RequestCard;
