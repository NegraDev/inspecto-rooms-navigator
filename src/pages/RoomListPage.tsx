
import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { RoomCard } from '@/components/room/RoomCard';
import { FilterBar } from '@/components/filter/FilterBar';
import { rooms as mockRooms, towers as mockTowers } from '@/data/mockData';
import { FilterOptions, Room, Tower } from '@/types';
import { Button } from '@/components/ui/button';
import { Grid, List, AlertCircle, FileSpreadsheet, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const RoomListPage = () => {
  const [towers, setTowers] = useState<Tower[]>(mockTowers);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(mockRooms);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [importSource, setImportSource] = useState<'mock' | 'imported'>('mock');
  
  // Carregar dados importados, se existirem
  useEffect(() => {
    const importedTowers = localStorage.getItem('importedTowers');
    const importedRooms = localStorage.getItem('importedRooms');
    
    if (importedTowers && importedRooms) {
      try {
        const parsedTowers = JSON.parse(importedTowers);
        const parsedRooms = JSON.parse(importedRooms);
        
        if (Array.isArray(parsedTowers) && Array.isArray(parsedRooms) && 
            parsedTowers.length > 0 && parsedRooms.length > 0) {
          setTowers(parsedTowers);
          setRooms(parsedRooms);
          setFilteredRooms(parsedRooms);
          setImportSource('imported');
        }
      } catch (error) {
        console.error('Erro ao carregar dados importados:', error);
      }
    }
  }, []);
  
  const handleFilterChange = (filters: FilterOptions) => {
    setActiveFilters(filters);
  };
  
  // Apply filters when activeFilters changes
  useEffect(() => {
    let result = [...rooms];
    
    if (activeFilters.tower) {
      result = result.filter(room => room.towerId === activeFilters.tower);
    }
    
    if (activeFilters.floor) {
      result = result.filter(room => room.floorNumber === activeFilters.floor);
    }
    
    if (activeFilters.wing) {
      result = result.filter(room => room.wingId === activeFilters.wing);
    }
    
    if (activeFilters.status && activeFilters.status.length > 0) {
      result = result.filter(room => activeFilters.status?.includes(room.status));
    }
    
    if (activeFilters.equipment && activeFilters.equipment.length > 0) {
      result = result.filter(room => 
        room.equipment.some(e => activeFilters.equipment?.includes(e.type))
      );
    }
    
    setFilteredRooms(result);
  }, [activeFilters, rooms]);
  
  return (
    <PageLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Salas</h1>
            <p className="text-muted-foreground">
              Visualize todas as salas disponíveis no edifício
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="h-9 w-9"
            >
              <Grid className="h-4 w-4" />
              <span className="sr-only">Visualização em grade</span>
            </Button>
            
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="h-9 w-9"
            >
              <List className="h-4 w-4" />
              <span className="sr-only">Visualização em lista</span>
            </Button>
            
            <Link to="/import">
              <Button variant="outline" className="h-9 flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                <span className="hidden sm:inline">Importar</span>
              </Button>
            </Link>
          </div>
        </div>
        
        {importSource === 'imported' && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-blue-700 text-sm flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            <span>Utilizando dados importados. {rooms.length} salas de {towers.length} torres carregadas.</span>
          </div>
        )}
        
        <FilterBar 
          towers={towers}
          onFilterChange={handleFilterChange}
        />
        
        {filteredRooms.length === 0 ? (
          <div className="text-center py-16 bg-muted/20 rounded-lg border border-muted">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-medium">Nenhuma sala encontrada</h2>
            <p className="mt-2 text-muted-foreground">
              Tente ajustar os filtros para encontrar o que está procurando.
            </p>
          </div>
        ) : (
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
            }
          `}>
            {filteredRooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default RoomListPage;
