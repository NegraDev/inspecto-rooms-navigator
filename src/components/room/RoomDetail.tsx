
import React from 'react';
import { Room } from '@/types';
import { Separator } from '@/components/ui/separator';
import { RoomHeader } from './components/RoomHeader';
import { RoomActions } from './components/RoomActions';
import { EquipmentCard } from './components/EquipmentCard';

interface RoomDetailProps {
  room: Room;
}

export const RoomDetail: React.FC<RoomDetailProps> = ({ room }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg overflow-hidden shadow-subtle border border-gray-100">
        <RoomHeader
          name={room.name}
          image={room.image}
          towerId={room.towerId}
          floorNumber={room.floorNumber}
          capacity={room.capacity}
        />
        
        <div className="p-6">
          <RoomActions room={room} />
          
          <Separator className="my-6" />
          
          <h2 className="text-lg font-semibold mb-4">Equipamentos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {room.equipment.map((equipment) => (
              <EquipmentCard key={equipment.id} equipment={equipment} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
