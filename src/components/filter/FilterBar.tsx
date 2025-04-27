
import React, { useState } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FilterOptions, EquipmentType, RoomStatus, Tower } from '@/types';
import { X, Filter, Check } from 'lucide-react';

interface FilterBarProps {
  towers: Tower[];
  onFilterChange: (filters: FilterOptions) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ towers, onFilterChange }) => {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    onFilterChange({});
  };
  
  const hasActiveFilters = Object.keys(filters).length > 0 || searchTerm.length > 0;
  
  // Função para criar array de andares com base na torre selecionada
  const getFloorOptions = () => {
    if (filters.tower) {
      const tower = towers.find(t => t.id === filters.tower);
      if (tower && tower.floors) {
        // Converta para array de números se for único número
        const floorsArray = Array.isArray(tower.floors) ? tower.floors : [tower.floors];
        return Array.from({ length: Math.max(...floorsArray) }, (_, i) => i + 1);
      }
    }
    return Array.from({ length: 20 }, (_, i) => i + 1);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-subtle border border-gray-100 p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por número ou nome da sala..."
            className="w-full pl-10"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        
        {hasActiveFilters && (
          <Button 
            onClick={clearFilters}
            variant="ghost" 
            size="sm"
            className="flex items-center gap-1 text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span>Limpar filtros</span>
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-3">
        <div className="w-full sm:w-auto">
          <Select
            value={filters.tower}
            onValueChange={(value) => handleFilterChange('tower', value)}
          >
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="Torre" />
            </SelectTrigger>
            <SelectContent>
              {towers.map(tower => (
                <SelectItem key={tower.id} value={tower.id}>
                  {tower.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full sm:w-auto">
          <Select
            value={filters.floor?.toString()}
            onValueChange={(value) => handleFilterChange('floor', parseInt(value))}
          >
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="Andar" />
            </SelectTrigger>
            <SelectContent>
              {getFloorOptions().map(floor => (
                <SelectItem key={floor.toString()} value={floor.toString()}>
                  Andar {floor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full sm:w-auto">
          <Select
            value={filters.wing}
            onValueChange={(value) => handleFilterChange('wing', value)}
          >
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="Ala" />
            </SelectTrigger>
            <SelectContent>
              {filters.tower
                ? towers
                    .find(t => t.id === filters.tower)
                    ?.wings.map(wing => (
                      <SelectItem key={wing.id} value={wing.id}>
                        {wing.name}
                      </SelectItem>
                    ))
                : towers.flatMap(t => t.wings).map(wing => (
                    <SelectItem key={wing.id} value={wing.id}>
                      {wing.name}
                    </SelectItem>
                  ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full sm:w-auto">
          <Select
            value={filters.status?.[0]}
            onValueChange={(value) => handleFilterChange('status', [value as RoomStatus])}
          >
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(RoomStatus).map(status => (
                <SelectItem key={status} value={status}>
                  {
                    {
                      [RoomStatus.AVAILABLE]: "Disponível",
                      [RoomStatus.OCCUPIED]: "Ocupada",
                      [RoomStatus.MAINTENANCE]: "Em Manutenção",
                      [RoomStatus.INSPECTION_NEEDED]: "Inspeção Necessária",
                      [RoomStatus.INSPECTED]: "Inspecionada"
                    }[status]
                  }
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full sm:w-auto">
          <Select
            value={filters.equipment?.[0]}
            onValueChange={(value) => handleFilterChange('equipment', [value as EquipmentType])}
          >
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="Equipamento" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(EquipmentType).map(type => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {hasActiveFilters && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 flex items-center gap-1">
            <Filter className="h-3 w-3" />
            <span>Filtros ativos</span>
          </Badge>
          
          {searchTerm && (
            <Badge variant="outline" className="bg-gray-100 text-gray-700 flex items-center gap-1">
              <span>Busca: {searchTerm}</span>
              <button 
                onClick={() => setSearchTerm('')}
                className="ml-1 hover:bg-gray-200 p-0.5 rounded-full"
              >
                <X className="h-2 w-2" />
              </button>
            </Badge>
          )}
          
          {filters.tower && (
            <Badge variant="outline" className="bg-gray-100 text-gray-700 flex items-center gap-1">
              <span>Torre: {towers.find(t => t.id === filters.tower)?.name}</span>
              <button 
                onClick={() => handleFilterChange('tower', undefined)}
                className="ml-1 hover:bg-gray-200 p-0.5 rounded-full"
              >
                <X className="h-2 w-2" />
              </button>
            </Badge>
          )}
          
          {filters.floor && (
            <Badge variant="outline" className="bg-gray-100 text-gray-700 flex items-center gap-1">
              <span>Andar: {filters.floor}</span>
              <button 
                onClick={() => handleFilterChange('floor', undefined)}
                className="ml-1 hover:bg-gray-200 p-0.5 rounded-full"
              >
                <X className="h-2 w-2" />
              </button>
            </Badge>
          )}
          
          {filters.wing && (
            <Badge variant="outline" className="bg-gray-100 text-gray-700 flex items-center gap-1">
              <span>Ala: {towers.flatMap(t => t.wings).find(w => w.id === filters.wing)?.name}</span>
              <button 
                onClick={() => handleFilterChange('wing', undefined)}
                className="ml-1 hover:bg-gray-200 p-0.5 rounded-full"
              >
                <X className="h-2 w-2" />
              </button>
            </Badge>
          )}
          
          {filters.status && filters.status.length > 0 && (
            <Badge variant="outline" className="bg-gray-100 text-gray-700 flex items-center gap-1">
              <span>Status: {
                {
                  [RoomStatus.AVAILABLE]: "Disponível",
                  [RoomStatus.OCCUPIED]: "Ocupada",
                  [RoomStatus.MAINTENANCE]: "Em Manutenção",
                  [RoomStatus.INSPECTION_NEEDED]: "Inspeção Necessária",
                  [RoomStatus.INSPECTED]: "Inspecionada"
                }[filters.status[0]]
              }</span>
              <button 
                onClick={() => handleFilterChange('status', undefined)}
                className="ml-1 hover:bg-gray-200 p-0.5 rounded-full"
              >
                <X className="h-2 w-2" />
              </button>
            </Badge>
          )}
          
          {filters.equipment && filters.equipment.length > 0 && (
            <Badge variant="outline" className="bg-gray-100 text-gray-700 flex items-center gap-1">
              <span>Equipamento: {filters.equipment[0]}</span>
              <button 
                onClick={() => handleFilterChange('equipment', undefined)}
                className="ml-1 hover:bg-gray-200 p-0.5 rounded-full"
              >
                <X className="h-2 w-2" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
