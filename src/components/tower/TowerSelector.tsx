
import React from 'react';
import { Building } from 'lucide-react';
import { Tower } from '@/types';
import { RoomStatusLegend } from './RoomStatusLegend';
import { RoomStatus } from '@/types';

interface TowerSelectorProps {
  towers: Tower[];
  selectedTower: Tower;
  onTowerSelect: (tower: Tower) => void;
  getRoomStatusColor: (status: RoomStatus) => string;
}

export const TowerSelector: React.FC<TowerSelectorProps> = ({
  towers,
  selectedTower,
  onTowerSelect,
  getRoomStatusColor
}) => {
  return (
    <div className="md:w-1/4">
      <div className="bg-white rounded-lg shadow-subtle border border-gray-100 p-4">
        <h3 className="font-semibold mb-3">Torres</h3>
        <div className="space-y-2">
          {towers.map(tower => (
            <button
              key={tower.id}
              onClick={() => onTowerSelect(tower)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTower.id === tower.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span>{tower.name}</span>
              </div>
            </button>
          ))}
        </div>
        
        <h3 className="font-semibold mt-6 mb-3">Legenda</h3>
        <RoomStatusLegend getRoomStatusColor={getRoomStatusColor} />
      </div>
    </div>
  );
};
