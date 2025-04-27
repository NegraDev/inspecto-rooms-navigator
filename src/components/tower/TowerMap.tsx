
import React, { useState } from 'react';
import { Equipment, EquipmentStatus, EquipmentType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Tv, Radio, Battery, Cable, Power, Filter, Volume2,
  CheckCircle, AlertTriangle, Wrench, HelpCircle, Camera
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

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

// Adicionado componente TowerMap
import { Tower, Room } from '@/types';
import { useState as useReactState, useEffect } from 'react';
import { FloorSelector } from './FloorSelector';
import { TowerSelector } from './TowerSelector';
import { FloorMap } from './FloorMap';
import { RoomStatusLegend } from './RoomStatusLegend';
import { useIsMobile } from '@/hooks/use-mobile';

interface TowerMapProps {
  towers: Tower[];
  rooms: Room[];
}

export const TowerMap: React.FC<TowerMapProps> = ({ towers, rooms }) => {
  const [selectedTower, setSelectedTower] = useReactState<Tower | null>(towers.length > 0 ? towers[0] : null);
  const [selectedFloor, setSelectedFloor] = useReactState<number | null>(
    selectedTower && selectedTower.floors.length > 0 ? selectedTower.floors[0] : null
  );
  const isMobile = useIsMobile();
  
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
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className={`${isMobile ? 'w-full' : 'w-1/3'} space-y-4`}>
          <TowerSelector 
            towers={towers} 
            selectedTower={selectedTower} 
            onSelectTower={setSelectedTower} 
          />
          
          {selectedTower && (
            <FloorSelector 
              floors={selectedTower.floors} 
              selectedFloor={selectedFloor} 
              onSelectFloor={setSelectedFloor} 
            />
          )}
          
          <RoomStatusLegend />
        </div>
        
        <div className={`${isMobile ? 'w-full' : 'w-2/3'}`}>
          {selectedTower && selectedFloor !== null ? (
            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <h3 className="text-lg font-medium mb-4">
                Torre {selectedTower.name} - Andar {selectedFloor}
                <span className="text-sm text-muted-foreground ml-2">
                  ({filteredRooms.length} salas)
                </span>
              </h3>
              
              <FloorMap rooms={filteredRooms} />
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
