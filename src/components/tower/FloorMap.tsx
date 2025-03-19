
import React from 'react';
import { Room, RoomStatus } from '@/types';
import { Badge } from '@/components/ui/badge';

interface FloorMapProps {
  selectedTower: string;
  selectedFloor: number;
  floorRooms: Room[];
  onRoomClick: (roomId: string) => void;
  getRoomStatusColor: (status: RoomStatus) => string;
}

export const FloorMap: React.FC<FloorMapProps> = ({
  selectedTower,
  selectedFloor,
  floorRooms,
  onRoomClick,
  getRoomStatusColor
}) => {
  return (
    <div className="flex-1 bg-white rounded-r-lg shadow-subtle border border-l-0 border-gray-100 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {selectedTower} - Andar {selectedFloor}
        </h2>
        <Badge className="bg-primary/10 text-primary border-primary/20">
          {floorRooms.length} salas
        </Badge>
      </div>
      
      <div className="aspect-video bg-gray-50 rounded-md border border-gray-200 relative p-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-2xl">
            {/* Simplified floor map layout */}
            <div className="absolute left-1/2 top-0 h-1 w-[85%] bg-gray-300 transform -translate-x-1/2" />
            <div className="absolute left-1/2 bottom-0 h-1 w-[85%] bg-gray-300 transform -translate-x-1/2" />
            <div className="absolute left-0 top-1/2 w-1 h-[85%] bg-gray-300 transform -translate-y-1/2" />
            <div className="absolute right-0 top-1/2 w-1 h-[85%] bg-gray-300 transform -translate-y-1/2" />
            
            {/* Plot rooms on the map */}
            {floorRooms.map((room) => {
              // Calculate position based on wing and room number
              const isNorthWing = room.wingId.includes('Norte');
              const roomsPerWing = floorRooms.filter(r => r.wingId === room.wingId).length;
              const roomIndexInWing = floorRooms.filter(r => r.wingId === room.wingId).indexOf(room);
              
              const top = isNorthWing ? '20%' : '70%';
              const left = 15 + (roomIndexInWing * (70 / Math.max(roomsPerWing, 1))) + '%';
              
              return (
                <button
                  key={room.id}
                  onClick={() => onRoomClick(room.id)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary"
                  style={{ top, left }}
                >
                  <div 
                    className={`w-12 h-12 rounded-md ${getRoomStatusColor(room.status)} text-white flex items-center justify-center shadow-md`}
                  >
                    <span className="font-medium text-xs">{room.number}</span>
                  </div>
                </button>
              );
            })}
            
            {/* Wing labels */}
            <div className="absolute left-1/2 top-[10%] transform -translate-x-1/2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium border border-gray-200">
              Ala Norte
            </div>
            <div className="absolute left-1/2 bottom-[10%] transform -translate-x-1/2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium border border-gray-200">
              Ala Sul
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {floorRooms.map(room => (
          <button
            key={room.id}
            onClick={() => onRoomClick(room.id)}
            className="p-3 bg-white rounded-md shadow-subtle border border-gray-100 text-left hover:shadow-elevation transition-shadow"
          >
            <div className="flex justify-between items-start">
              <span className="font-medium">{room.number}</span>
              <div className={`h-2 w-2 rounded-full ${getRoomStatusColor(room.status)}`}></div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">{room.name}</div>
            <div className="text-xs text-muted-foreground">{room.equipment.length} equipamentos</div>
          </button>
        ))}
      </div>
    </div>
  );
};
