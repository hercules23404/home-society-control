
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";

interface UtilityWorker {
  name: string;
  role: string;
}

interface UtilityWorkersSectionProps {
  utilityWorkers: UtilityWorker[];
  setUtilityWorkers: React.Dispatch<React.SetStateAction<UtilityWorker[]>>;
}

export const UtilityWorkersSection = ({ 
  utilityWorkers, 
  setUtilityWorkers 
}: UtilityWorkersSectionProps) => {
  const [workerName, setWorkerName] = useState("");
  const [workerRole, setWorkerRole] = useState("");

  const addUtilityWorker = () => {
    if (workerName.trim() !== "" && workerRole.trim() !== "") {
      setUtilityWorkers([
        ...utilityWorkers,
        { name: workerName.trim(), role: workerRole.trim() },
      ]);
      setWorkerName("");
      setWorkerRole("");
    }
  };

  const removeUtilityWorker = (index: number) => {
    setUtilityWorkers(utilityWorkers.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <FormLabel>Utility Workers (Optional)</FormLabel>
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Worker name"
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
              />
            </div>
            <div>
              <FormLabel>Role</FormLabel>
              <Input
                placeholder="e.g. Security Guard"
                value={workerRole}
                onChange={(e) => setWorkerRole(e.target.value)}
              />
            </div>
          </div>
          <Button 
            type="button" 
            onClick={addUtilityWorker}
            variant="outline"
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Utility Worker
          </Button>
          
          {utilityWorkers.length > 0 && (
            <div className="mt-4 space-y-2">
              {utilityWorkers.map((worker, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium">{worker.name}</p>
                    <p className="text-sm text-gray-500">{worker.role}</p>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeUtilityWorker(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
