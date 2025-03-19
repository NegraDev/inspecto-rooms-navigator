
import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { TowerMap } from '@/components/tower/TowerMap';
import { towers as mockTowers, rooms as mockRooms } from '@/data/mockData';
import { Tower, Room } from '@/types';
import { FileSpreadsheet } from 'lucide-react';

const MapPage = () => {
  const [towers, setTowers] = useState<Tower[]>(mockTowers);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
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
          setImportSource('imported');
        }
      } catch (error) {
        console.error('Erro ao carregar dados importados:', error);
      }
    }
  }, []);
  
  return (
    <PageLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Mapa</h1>
          <p className="text-muted-foreground">
            Visualize as torres e salas disponíveis para inspeção
          </p>
        </div>
        
        {importSource === 'imported' && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-blue-700 text-sm flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            <span>Visualizando mapa com dados importados. {rooms.length} salas de {towers.length} torres carregadas.</span>
          </div>
        )}
        
        <TowerMap towers={towers} rooms={rooms} />
      </div>
    </PageLayout>
  );
};

export default MapPage;
