
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tower, Room, RoomStatus } from '@/types';
import { towers } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { 
  ChevronUp, 
  ChevronDown,
  Building
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TowerMapProps {
  towers: Tower[];
  rooms: Room[];
}

export const TowerMap: React.FC<TowerMapProps> = ({ towers, rooms }) => {
  const [selectedTower, setSelectedTower] = useState<Tower>(towers[0]);
  const [selectedFloor, setSelectedFloor] = useState<number>(10);
  const navigate = useNavigate();
  
  const handleFloorChange = (floor: number) => {
    setSelectedFloor(floor);
  };
  
  const handleRoomClick = (roomId: string) => {
    navigate(`/rooms/${roomId}`);
  };
  
  // Get rooms for the selected floor and tower
  const floorRooms = rooms.filter(
    room => room.towerId === selectedTower.id && room.floorNumber === selectedFloor
  );
  
  const getRoomStatusColor = (status: RoomStatus) => {
    switch (status) {
      case RoomStatus.AVAILABLE:
        return "bg-green-500";
      case RoomStatus.OCCUPIED:
        return "bg-blue-500";
      case RoomStatus.MAINTENANCE:
        return "bg-orange-500";
      case RoomStatus.INSPECTION_NEEDED:
        return "bg-red-500";
      case RoomStatus.INSPECTED:
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/4">
        <div className="bg-white rounded-lg shadow-subtle border border-gray-100 p-4">
          <h3 className="font-semibold mb-3">Torres</h3>
          <div className="space-y-2">
            {towers.map(tower => (
              <button
                key={tower.id}
                onClick={() => setSelectedTower(tower)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTower.id === tower.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span>{tower.name}</span>
                </div>
              </button>
            ))}
          </div>
          
          <h3 className="font-semibold mt-6 mb-3">Legenda</h3>
          <div className="space-y-2">
            {Object.values(RoomStatus).map(status => (
              <div key={status} className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${getRoomStatusColor(status)}`}></div>
                <span className="text-sm">
                  {
                    {
                      [RoomStatus.AVAILABLE]: "Disponível",
                      [RoomStatus.OCCUPIED]: "Ocupada",
                      [RoomStatus.MAINTENANCE]: "Em Manutenção",
                      [RoomStatus.INSPECTION_NEEDED]: "Inspeção Necessária",
                      [RoomStatus.INSPECTED]: "Inspecionada"
                    }[status]
                  }
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex">
        <div className="w-12 bg-white rounded-l-lg shadow-subtle border border-gray-100 flex flex-col items-center py-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleFloorChange(Math.min(selectedFloor + 1, selectedTower.floors))}
            disabled={selectedFloor >= selectedTower.floors}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 flex flex-col items-center justify-center gap-2 overflow-y-auto py-4">
            {Array.from({ length: selectedTower.floors }, (_, i) => selectedTower.floors - i).map(floor => (
              <button
                key={floor}
                onClick={() => handleFloorChange(floor)}
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
            onClick={() => handleFloorChange(Math.max(selectedFloor - 1, 1))}
            disabled={selectedFloor <= 1}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 bg-white rounded-r-lg shadow-subtle border border-l-0 border-gray-100 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {selectedTower.name} - Andar {selectedFloor}
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
                {floorRooms.map((room, index) => {
                  // Calculate position based on wing and room number
                  const isNorthWing = room.wingId.includes('Norte');
                  const roomsPerWing = floorRooms.filter(r => r.wingId === room.wingId).length;
                  const roomIndexInWing = floorRooms.filter(r => r.wingId === room.wingId).indexOf(room);
                  
                  const top = isNorthWing ? '20%' : '70%';
                  const left = 15 + (roomIndexInWing * (70 / Math.max(roomsPerWing, 1))) + '%';
                  
                  return (
                    <button
                      key={room.id}
                      onClick={() => handleRoomClick(room.id)}
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
                onClick={() => handleRoomClick(room.id)}
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
      </div>
    </div>
  );
};
