
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { TowerMap } from '@/components/tower/TowerMap';
import { towers, rooms } from '@/data/mockData';

const MapPage = () => {
  return (
    <PageLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Mapa</h1>
          <p className="text-muted-foreground">
            Visualize as torres e salas disponíveis para inspeção
          </p>
        </div>
        
        <TowerMap towers={towers} rooms={rooms} />
      </div>
    </PageLayout>
  );
};

export default MapPage;
