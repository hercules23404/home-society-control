
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";

interface AmenitiesSectionProps {
  amenities: string[];
  setAmenities: React.Dispatch<React.SetStateAction<string[]>>;
}

export const AmenitiesSection = ({ amenities, setAmenities }: AmenitiesSectionProps) => {
  const [amenityInput, setAmenityInput] = useState("");

  const addAmenity = () => {
    if (amenityInput.trim() !== "" && !amenities.includes(amenityInput.trim())) {
      setAmenities([...amenities, amenityInput.trim()]);
      setAmenityInput("");
    }
  };

  const removeAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <FormLabel>Amenities (Optional)</FormLabel>
      <div className="flex items-center space-x-2">
        <Input
          placeholder="e.g. Swimming Pool"
          value={amenityInput}
          onChange={(e) => setAmenityInput(e.target.value)}
          className="flex-1"
        />
        <Button 
          type="button" 
          onClick={addAmenity}
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
      {amenities.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {amenities.map((amenity, index) => (
            <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
              {amenity}
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-4 w-4 p-0 ml-1"
                onClick={() => removeAmenity(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
