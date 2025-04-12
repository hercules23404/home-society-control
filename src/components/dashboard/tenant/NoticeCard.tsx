
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface NoticeCardProps {
  title: string;
  content: string;
  date: string | Date;
  category?: "general" | "maintenance" | "events" | "emergency";
}

const NoticeCard = ({ title, content, date, category = "general" }: NoticeCardProps) => {
  const formattedDate = typeof date === 'string' ? date : format(date, "MMM dd, yyyy");
  
  const getCategoryStyles = () => {
    switch (category) {
      case "emergency":
        return "bg-red-50 border-red-200";
      case "maintenance":
        return "bg-amber-50 border-amber-200";
      case "events":
        return "bg-green-50 border-green-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };
  
  const getCategoryBadgeStyles = () => {
    switch (category) {
      case "emergency":
        return "bg-red-100 text-red-800";
      case "maintenance":
        return "bg-amber-100 text-amber-800";
      case "events":
        return "bg-green-100 text-green-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className={cn("border rounded-lg p-5", getCategoryStyles())}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg text-rental-text">{title}</h3>
        <div className={cn("text-xs px-2 py-1 rounded-full capitalize", getCategoryBadgeStyles())}>
          {category}
        </div>
      </div>
      
      <p className="text-rental-text-light mb-4">{content}</p>
      
      <div className="flex items-center text-sm text-rental-text-light">
        <CalendarIcon className="h-4 w-4 mr-1" />
        <span>{formattedDate}</span>
      </div>
    </div>
  );
};

export default NoticeCard;
