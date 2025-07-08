
import React, { useState } from 'react';
import { Room, EquipmentStatus } from '@/types';
import { Separator } from '@/components/ui/separator';
import { RoomHeader } from './components/RoomHeader';
import { RoomActions } from './components/RoomActions';
import { EquipmentCard } from './components/EquipmentCard';
import { toast } from '@/hooks/use-toast';

interface RoomDetailProps {
  room: Room;
}

export const RoomDetail: React.FC<RoomDetailProps> = ({ room }) => {
  const [equipmentStatus, setEquipmentStatus] = useState(
    Object.fromEntries(room.equipment.map(e => [e.id, e.status === EquipmentStatus.WORKING]))
  );

  const handleEquipmentStatusChange = (equipmentId: string, working: boolean) => {
    setEquipmentStatus(prev => ({
      ...prev,
      [equipmentId]: working
    }));

    toast({
      title: working ? "Equipamento marcado como funcionando" : "Equipamento marcado com defeito",
      description: `Status do equipamento atualizado.`,
      variant: working ? "default" : "destructive"
    });
  };

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
              <EquipmentCard 
                key={equipment.id} 
                equipment={equipment} 
                onStatusChange={handleEquipmentStatusChange}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
