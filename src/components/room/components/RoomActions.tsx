
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { ServiceTicketButton } from '../ServiceTicketButton';
import { Room } from '@/types';
import { useNavigate } from 'react-router-dom';

interface RoomActionsProps {
  room: Room;
}

export const RoomActions: React.FC<RoomActionsProps> = ({ room }) => {
  const navigate = useNavigate();
  
  const inspectRoom = () => {
    navigate(`/camera?roomId=${room.id}`);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button 
        onClick={inspectRoom}
        className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
      >
        <Camera className="h-4 w-4" />
        Iniciar Inspeção
      </Button>
      
      <Button variant="outline" className="border-gray-200">
        Histórico de Inspeções
      </Button>
      
      <Button variant="outline" className="border-gray-200">
        Gerar Relatório
      </Button>
      
      <ServiceTicketButton 
        roomId={room.id}
        roomName={room.name}
        equipment={room.equipment}
      />
    </div>
  );
};
