
import React from 'react';
import { Users } from 'lucide-react';

interface RoomHeaderProps {
  name: string;
  image: string | undefined;
  towerId: string;
  floorNumber: number;
  capacity: number;
}

export const RoomHeader: React.FC<RoomHeaderProps> = ({
  name,
  image,
  towerId,
  floorNumber,
  capacity,
}) => {
  return (
    <div className="h-64 bg-gray-100 relative">
      <img 
        src={image || "/placeholder.svg"} 
        alt={name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h1 className="text-2xl font-bold">{name}</h1>
        <p className="text-sm mt-1 opacity-90 flex items-center gap-2">
          {`Torre ${towerId === 't1' ? 'A' : 'B'} • Andar ${floorNumber}`}
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {`Capacidade: ${capacity} pessoas`}
          </span>
        </p>
      </div>
    </div>
  );
};
