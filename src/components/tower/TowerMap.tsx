
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tower, Room } from '@/types';
import { FloorSelector } from './FloorSelector';
import { TowerSelector } from './TowerSelector';
import { FloorMap } from './FloorMap';
import { getRoomStatusColor } from '@/utils/roomStatusUtils';

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
  
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <TowerSelector 
        towers={towers}
        selectedTower={selectedTower}
        onTowerSelect={setSelectedTower}
        getRoomStatusColor={getRoomStatusColor}
      />
      
      <div className="flex-1 flex">
        <FloorSelector 
          floors={selectedTower.floors}
          selectedFloor={selectedFloor}
          onFloorChange={handleFloorChange}
        />
        
        <FloorMap 
          selectedTower={selectedTower.name}
          selectedFloor={selectedFloor}
          floorRooms={floorRooms}
          onRoomClick={handleRoomClick}
          getRoomStatusColor={getRoomStatusColor}
        />
      </div>
    </div>
  );
};
