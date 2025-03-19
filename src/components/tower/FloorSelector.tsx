
import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloorSelectorProps {
  floors: number;
  selectedFloor: number;
  onFloorChange: (floor: number) => void;
}

export const FloorSelector: React.FC<FloorSelectorProps> = ({
  floors,
  selectedFloor,
  onFloorChange
}) => {
  return (
    <div className="w-12 bg-white rounded-l-lg shadow-subtle border border-gray-100 flex flex-col items-center py-4">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onFloorChange(Math.min(selectedFloor + 1, floors))}
        disabled={selectedFloor >= floors}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      
      <div className="flex-1 flex flex-col items-center justify-center gap-2 overflow-y-auto py-4">
        {Array.from({ length: floors }, (_, i) => floors - i).map(floor => (
          <button
            key={floor}
            onClick={() => onFloorChange(floor)}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              selectedFloor === floor
                ? "bg-primary text-primary-foreground"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {floor}
          </button>
        ))}
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onFloorChange(Math.max(selectedFloor - 1, 1))}
        disabled={selectedFloor <= 1}
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
};
