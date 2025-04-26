
import React from 'react';
import { Room, Equipment, EquipmentType, EquipmentStatus } from '@/types';
import { 
  Tv, 
  Wind, 
  Cable, 
  DoorClosed, 
  Lightbulb, 
  Filter, 
  Power, 
  CheckCircle, 
  AlertTriangle,
  Wrench,
  HelpCircle,
  Users,
  Radio,
  Battery,
  Volume2,
  Camera
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { ServiceTicketButton } from './ServiceTicketButton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface RoomDetailProps {
  room: Room;
}

const getEquipmentIcon = (type: EquipmentType) => {
  switch (type) {
    case EquipmentType.TV:
      return <Tv className="h-5 w-5" />;
    case EquipmentType.REMOTE:
      return <Radio className="h-5 w-5" />;
    case EquipmentType.BATTERIES:
      return <Battery className="h-5 w-5" />;
    case EquipmentType.HDMI_CABLE:
      return <Cable className="h-5 w-5" />;
    case EquipmentType.MTR:
      return <Tv className="h-5 w-5" />;
    case EquipmentType.SWITCH_CABLE_HUB:
      return <Cable className="h-5 w-5" />;
    case EquipmentType.MTOUCH:
      return <Radio className="h-5 w-5" />;
    case EquipmentType.OUTLETS:
      return <Power className="h-5 w-5" />;
    case EquipmentType.FILTER:
      return <Filter className="h-5 w-5" />;
    case EquipmentType.MICROPHONE:
      return <Radio className="h-5 w-5" />;
    case EquipmentType.SPEAKER:
      return <Volume2 className="h-5 w-5" />;
    default:
      return null;
  }
};

const getStatusIcon = (status: EquipmentStatus) => {
  switch (status) {
    case EquipmentStatus.WORKING:
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case EquipmentStatus.DAMAGED:
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    case EquipmentStatus.MAINTENANCE:
      return <Wrench className="h-5 w-5 text-orange-500" />;
    case EquipmentStatus.UNKNOWN:
      return <HelpCircle className="h-5 w-5 text-gray-500" />;
    default:
      return null;
  }
};

const getStatusColor = (status: EquipmentStatus) => {
  switch (status) {
    case EquipmentStatus.WORKING:
      return "bg-green-50 border-green-200 text-green-700";
    case EquipmentStatus.DAMAGED:
      return "bg-red-50 border-red-200 text-red-700";
    case EquipmentStatus.MAINTENANCE:
      return "bg-orange-50 border-orange-200 text-orange-700";
    case EquipmentStatus.UNKNOWN:
      return "bg-gray-50 border-gray-200 text-gray-700";
    default:
      return "bg-gray-50 border-gray-200 text-gray-700";
  }
};

const statusText = {
  [EquipmentStatus.WORKING]: "Funcionando",
  [EquipmentStatus.DAMAGED]: "Danificado",
  [EquipmentStatus.MAINTENANCE]: "Em Manutenção",
  [EquipmentStatus.UNKNOWN]: "Não Verificado"
};

export const RoomDetail: React.FC<RoomDetailProps> = ({ room }) => {
  const navigate = useNavigate();
  
  const inspectRoom = () => {
    navigate(`/camera?roomId=${room.id}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg overflow-hidden shadow-subtle border border-gray-100">
        <div className="h-64 bg-gray-100 relative">
          <img 
            src={room.image || "/placeholder.svg"} 
            alt={room.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-2xl font-bold">{room.name}</h1>
            <p className="text-sm mt-1 opacity-90 flex items-center gap-2">
              {`Torre ${room.towerId === 't1' ? 'A' : 'B'} • Andar ${room.floorNumber}`}
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {`Capacidade: ${room.capacity} pessoas`}
              </span>
            </p>
          </div>
        </div>
        
        <div className="p-6">
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

const EquipmentCard: React.FC<{ equipment: Equipment }> = ({ equipment }) => {
  return (
    <Card className="border border-gray-100 hover:border-gray-200 transition-colors">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          {getEquipmentIcon(equipment.type)}
          <span>{equipment.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-3">
          <Badge className={`${getStatusColor(equipment.status)}`}>
            {statusText[equipment.status]}
          </Badge>
          
          <div className="flex items-center">
            {getStatusIcon(equipment.status)}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <Label htmlFor={`equipment-status-${equipment.id}`} className="cursor-pointer">
            Status do Equipamento:
          </Label>
          <div className="flex items-center gap-2">
            <Switch 
              id={`equipment-status-${equipment.id}`}
              checked={equipment.status === EquipmentStatus.WORKING}
              disabled={true} // Somente pode ser alterado durante inspeção
            />
            <span className="text-sm">
              {equipment.status === EquipmentStatus.WORKING ? 'Funcionando' : 'Com Defeito'}
            </span>
          </div>
        </div>
        
        {equipment.status !== EquipmentStatus.WORKING && (
          <div className="bg-red-50 border border-red-200 rounded p-2 text-red-700 text-xs flex items-center gap-1 mb-2">
            <Camera className="h-3 w-3" />
            <span>Foto obrigatória para documentar o defeito</span>
          </div>
        )}
        
        {equipment.lastChecked && (
          <p className="text-xs text-muted-foreground mt-2">
            Última verificação: {new Date(equipment.lastChecked).toLocaleDateString('pt-BR')}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
