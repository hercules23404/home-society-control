
import { Bed, Bath, Home, MapPin, Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PropertyCardProps {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  type: "rent" | "sale";
  onViewClick?: (id: string) => void;
}

const PropertyCard = ({
  id,
  title,
  address,
  price,
  bedrooms,
  bathrooms,
  area,
  image,
  type,
  onViewClick,
}: PropertyCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="rounded-lg overflow-hidden bg-white border shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-w-16 aspect-h-10 relative">
        <img 
          src={image || "https://placehold.co/400x250?text=Property"} 
          alt={title}
          className="w-full h-[200px] object-cover"
        />
        <Badge
          className={cn(
            "absolute top-3 right-3",
            type === "rent" ? "bg-rental-primary" : "bg-rental-success"
          )}
        >
          {type === "rent" ? "For Rent" : "For Sale"}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-3 left-3 bg-white/80 backdrop-blur-sm hover:bg-white",
            isFavorite ? "text-red-500" : "text-gray-400"
          )}
          onClick={toggleFavorite}
        >
          <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
        </Button>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg mb-1 text-rental-text">{title}</h3>
            <div className="flex items-center text-sm text-rental-text-light mb-2">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span>{address}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <p className="font-semibold text-lg text-rental-primary">
            ₹{price.toLocaleString()}
            <span className="text-xs text-rental-text-light">
              {type === "rent" ? "/month" : ""}
            </span>
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-rental-text-light">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{bedrooms} {bedrooms === 1 ? 'Bed' : 'Beds'}</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{bathrooms} {bathrooms === 1 ? 'Bath' : 'Baths'}</span>
          </div>
          <div className="flex items-center">
            <Home className="h-4 w-4 mr-1" />
            <span>{area} sq.ft</span>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onViewClick && onViewClick(id)}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default PropertyCard;
