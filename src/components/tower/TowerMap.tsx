
import React, { useState, useEffect } from 'react';
import { Equipment, EquipmentStatus, EquipmentType, Tower, Room, RoomStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Tv, Radio, Battery, Cable, Power, Filter, Volume2,
  CheckCircle, AlertTriangle, Wrench, HelpCircle, Camera
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface EquipmentCardProps {
  equipment: Equipment;
  onStatusChange?: (equipmentId: string, working: boolean) => void;
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

export const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment, onStatusChange }) => {
  const [isWorking, setIsWorking] = useState(equipment.status === EquipmentStatus.WORKING);

  const handleStatusChange = (checked: boolean) => {
    setIsWorking(checked);
    
    if (onStatusChange) {
      onStatusChange(equipment.id, checked);
    } else {
      // Se não houver manipulador de mudança de status externo, mostre um toast
      toast({
        title: checked ? "Equipamento marcado como funcionando" : "Equipamento marcado com defeito",
        description: `Status do ${equipment.name} atualizado.`,
        variant: checked ? "default" : "destructive"
      });
    }
  };

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
              checked={isWorking}
              onCheckedChange={handleStatusChange}
            />
            <span className="text-sm">
              {isWorking ? 'Funcionando' : 'Com Defeito'}
            </span>
          </div>
        </div>
        
        {!isWorking && (
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

// Componente para mapa do andar
interface FloorMapComponentProps {
  rooms: Room[];
}

export const FloorMap: React.FC<FloorMapComponentProps> = ({ rooms }) => {
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

  const onRoomClick = (roomId: string) => {
    window.location.href = `/room/${roomId}`;
  };

  return (
    <div className="aspect-video bg-gray-50 rounded-md border border-gray-200 relative p-4">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full max-w-2xl">
          {/* Simplified floor map layout */}
          <div className="absolute left-1/2 top-0 h-1 w-[85%] bg-gray-300 transform -translate-x-1/2" />
          <div className="absolute left-1/2 bottom-0 h-1 w-[85%] bg-gray-300 transform -translate-x-1/2" />
          <div className="absolute left-0 top-1/2 w-1 h-[85%] bg-gray-300 transform -translate-y-1/2" />
          <div className="absolute right-0 top-1/2 w-1 h-[85%] bg-gray-300 transform -translate-y-1/2" />
          
          {/* Plot rooms on the map */}
          {rooms.map((room) => {
            // Calculate position based on wing and room number
            const isNorthWing = room.wingId.includes('Norte');
            const roomsPerWing = rooms.filter(r => r.wingId === room.wingId).length;
            const roomIndexInWing = rooms.filter(r => r.wingId === room.wingId).indexOf(room);
            
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
  );
};

// Componente completo do mapa da torre
interface TowerMapProps {
  towers: Tower[];
  rooms: Room[];
}

export const TowerMap: React.FC<TowerMapProps> = ({ towers, rooms }) => {
  const [selectedTower, setSelectedTower] = useState<Tower | null>(towers.length > 0 ? towers[0] : null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(
    selectedTower && selectedTower.floors.length > 0 ? selectedTower.floors[0] : null
  );
  
  // Atualizar o andar selecionado quando a torre mudar
  useEffect(() => {
    if (selectedTower && selectedTower.floors.length > 0) {
      setSelectedFloor(selectedTower.floors[0]);
    } else {
      setSelectedFloor(null);
    }
  }, [selectedTower]);
  
  // Filtrar salas pelo andar e torre selecionados
  const filteredRooms = rooms.filter(room => 
    room.towerId === selectedTower?.id && 
    room.floorNumber === selectedFloor
  );

  // Função para obter a cor do status da sala
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
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="w-full md:w-1/3 space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-lg font-medium mb-3">Selecione uma Torre</h3>
            <div className="grid grid-cols-2 gap-2">
              {towers.map((tower) => (
                <button
                  key={tower.id}
                  onClick={() => setSelectedTower(tower)}
                  className={`py-2 px-3 rounded-md border text-center transition-colors ${
                    selectedTower?.id === tower.id
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white border-gray-200 hover:border-primary/40'
                  }`}
                >
                  {tower.name}
                </button>
              ))}
            </div>
          </div>
          
          {selectedTower && (
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <h3 className="text-lg font-medium mb-3">Selecione um Andar</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {selectedTower.floors.map((floor) => (
                  <button
                    key={floor}
                    onClick={() => setSelectedFloor(floor)}
                    className={`py-2 px-3 rounded-md border text-center transition-colors ${
                      selectedFloor === floor
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white border-gray-200 hover:border-primary/40'
                    }`}
                  >
                    {floor}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-lg font-medium mb-3">Legenda</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500"></div>
                <span className="text-sm">Disponível</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-500"></div>
                <span className="text-sm">Ocupada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-orange-500"></div>
                <span className="text-sm">Em Manutenção</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500"></div>
                <span className="text-sm">Inspeção Necessária</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-purple-500"></div>
                <span className="text-sm">Inspecionada</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-2/3">
          {selectedTower && selectedFloor !== null ? (
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <h3 className="text-lg font-medium mb-4">
                Torre {selectedTower.name} - Andar {selectedFloor}
                <span className="text-sm text-muted-foreground ml-2">
                  ({filteredRooms.length} salas)
                </span>
              </h3>
              
              <FloorMap rooms={filteredRooms} />
              
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredRooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => window.location.href = `/room/${room.id}`}
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
          ) : (
            <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm text-center">
              <p className="text-muted-foreground">
                Selecione uma torre e um andar para visualizar o mapa.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
