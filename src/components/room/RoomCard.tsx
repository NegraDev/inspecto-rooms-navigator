
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Room, RoomStatus, EquipmentType } from '@/types';
import { Link } from 'react-router-dom';
import { 
  Tv, 
  Wind, 
  Cable, 
  DoorClosed, 
  Lightbulb, 
  Filter, 
  Power, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Wrench,
  MonitorCheck,
  Users
} from 'lucide-react';

interface RoomCardProps {
  room: Room;
}

const getStatusColor = (status: RoomStatus) => {
  switch (status) {
    case RoomStatus.AVAILABLE:
      return "bg-green-100 text-green-600 border-green-200";
    case RoomStatus.OCCUPIED:
      return "bg-blue-100 text-blue-600 border-blue-200";
    case RoomStatus.MAINTENANCE:
      return "bg-orange-100 text-orange-600 border-orange-200";
    case RoomStatus.INSPECTION_NEEDED:
      return "bg-red-100 text-red-600 border-red-200";
    case RoomStatus.INSPECTED:
      return "bg-purple-100 text-purple-600 border-purple-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
};

const getStatusIcon = (status: RoomStatus) => {
  switch (status) {
    case RoomStatus.AVAILABLE:
      return <CheckCircle2 className="h-3.5 w-3.5" />;
    case RoomStatus.OCCUPIED:
      return <Clock className="h-3.5 w-3.5" />;
    case RoomStatus.MAINTENANCE:
      return <Wrench className="h-3.5 w-3.5" />;
    case RoomStatus.INSPECTION_NEEDED:
      return <AlertCircle className="h-3.5 w-3.5" />;
    case RoomStatus.INSPECTED:
      return <MonitorCheck className="h-3.5 w-3.5" />;
    default:
      return null;
  }
};

const getEquipmentIcon = (type: EquipmentType) => {
  switch (type) {
    case EquipmentType.TV:
      return <Tv className="h-4 w-4" />;
    case EquipmentType.AC:
      return <Wind className="h-4 w-4" />;
    case EquipmentType.HDMI:
      return <Cable className="h-4 w-4" />;
    case EquipmentType.DOOR:
      return <DoorClosed className="h-4 w-4" />;
    case EquipmentType.WINDOW:
      return <DoorClosed className="h-4 w-4 rotate-90" />;
    case EquipmentType.LIGHT:
      return <Lightbulb className="h-4 w-4" />;
    case EquipmentType.FILTER:
      return <Filter className="h-4 w-4" />;
    case EquipmentType.OUTLET:
      return <Power className="h-4 w-4" />;
    default:
      return null;
  }
};

export const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const statusColor = getStatusColor(room.status);
  const statusIcon = getStatusIcon(room.status);
  
  // Format status text
  const statusText = {
    [RoomStatus.AVAILABLE]: "Disponível",
    [RoomStatus.OCCUPIED]: "Ocupada",
    [RoomStatus.MAINTENANCE]: "Em Manutenção",
    [RoomStatus.INSPECTION_NEEDED]: "Inspeção Necessária",
    [RoomStatus.INSPECTED]: "Inspecionada"
  }[room.status];
  
  return (
    <Link to={`/rooms/${room.id}`} className="block transform transition-all duration-300 hover:translate-y-[-4px]">
      <Card className="overflow-hidden h-full border border-gray-100 bg-white shadow-subtle hover:shadow-elevation transition-shadow duration-300">
        <div className="h-40 bg-gray-100 relative overflow-hidden">
          <img 
            src={room.image || "/placeholder.svg"} 
            alt={room.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute top-2 right-2">
            <Badge className={`${statusColor} flex items-center gap-1`}>
              {statusIcon}
              <span>{statusText}</span>
            </Badge>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent text-white p-3">
            <div className="font-semibold">{room.name}</div>
            <div className="text-sm opacity-90 flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> Capacidade: {room.capacity} pessoas
            </div>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-1 mb-2">
            {Object.values(EquipmentType).map(type => {
              const hasEquipment = room.equipment.some(e => e.type === type);
              if (!hasEquipment) return null;
              
              return (
                <Badge 
                  key={type} 
                  variant="outline"
                  className="bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1 py-1"
                >
                  {getEquipmentIcon(type)}
                  <span className="text-xs">{type}</span>
                </Badge>
              );
            })}
          </div>
          
          <div className="text-sm text-muted-foreground">
            {`Torre ${room.towerId === 't1' ? 'A' : 'B'} • Andar ${room.floorNumber}`}
          </div>
        </CardContent>
        
        <CardFooter className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex justify-between">
          <div className="text-xs text-muted-foreground">
            {room.lastInspection 
              ? `Última inspeção: ${new Date(room.lastInspection).toLocaleDateString('pt-BR')}`
              : 'Nunca inspecionada'}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
