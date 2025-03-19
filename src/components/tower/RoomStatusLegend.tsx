
import React from 'react';
import { RoomStatus } from '@/types';

interface RoomStatusLegendProps {
  getRoomStatusColor: (status: RoomStatus) => string;
}

export const RoomStatusLegend: React.FC<RoomStatusLegendProps> = ({ getRoomStatusColor }) => {
  return (
    <div className="space-y-2">
      {Object.values(RoomStatus).map(status => (
        <div key={status} className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${getRoomStatusColor(status)}`}></div>
          <span className="text-sm">
            {
              {
                [RoomStatus.AVAILABLE]: "Disponível",
                [RoomStatus.OCCUPIED]: "Ocupada",
                [RoomStatus.MAINTENANCE]: "Em Manutenção",
                [RoomStatus.INSPECTION_NEEDED]: "Inspeção Necessária",
                [RoomStatus.INSPECTED]: "Inspecionada"
              }[status]
            }
          </span>
        </div>
      ))}
    </div>
  );
};
