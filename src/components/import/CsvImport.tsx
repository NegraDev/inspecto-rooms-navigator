
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileCsv, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tower, Room, EquipmentType, EquipmentStatus, RoomStatus } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { v4 as uuidv4 } from 'uuid';
import Papa from 'papaparse';

interface CsvImportProps {
  onImportComplete: (towers: Tower[], rooms: Room[]) => void;
}

export const CsvImport: React.FC<CsvImportProps> = ({ onImportComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processCSV = async (csvData: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Parse CSV data
      const { data } = Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
      });

      if (!data || data.length === 0) {
        throw new Error('O arquivo CSV está vazio ou mal formatado');
      }

      // Maps to track unique towers and rooms
      const towersMap = new Map<string, Tower>();
      const roomsArray: Room[] = [];

      // Process each row in the CSV
      data.forEach((row: any) => {
        // Extract tower information
        const towerId = row.towerId || `t${uuidv4().substring(0, 4)}`;
        const towerName = row.towerName || 'Torre ' + (towersMap.size + 1);
        const floorNumber = parseInt(row.floorNumber) || 1;

        // Create or update tower
        if (!towersMap.has(towerId)) {
          towersMap.set(towerId, {
            id: towerId,
            name: towerName,
            floors: [floorNumber],
            wings: [{
              id: `w-north-${towerId}-${floorNumber}`,
              name: 'Norte',
              towerId,
              floorNumber
            }, {
              id: `w-south-${towerId}-${floorNumber}`,
              name: 'Sul',
              towerId,
              floorNumber
            }]
          });
        } else {
          const tower = towersMap.get(towerId)!;
          if (!tower.floors.includes(floorNumber)) {
            tower.floors.push(floorNumber);
            tower.wings.push({
              id: `w-north-${towerId}-${floorNumber}`,
              name: 'Norte',
              towerId,
              floorNumber
            });
            tower.wings.push({
              id: `w-south-${towerId}-${floorNumber}`,
              name: 'Sul',
              towerId,
              floorNumber
            });
          }
        }

        // Create room
        const roomId = row.roomId || `r-${uuidv4()}`;
        const roomNumber = row.roomNumber || `${floorNumber}${(roomsArray.length % 10) + 1}`;
        const roomName = row.roomName || `Sala ${roomNumber}`;
        const wingId = row.wingId || `w-north-${towerId}-${floorNumber}`;
        const capacity = parseInt(row.capacity) || 4;

        // Create equipment for the room
        const equipment = [];
        if (row.hasTV === 'true' || row.hasTV === '1') {
          equipment.push({
            id: `eq-tv-${roomId}`,
            name: 'Televisão',
            type: EquipmentType.TV,
            status: EquipmentStatus.WORKING
          });
        }

        if (row.hasRemote === 'true' || row.hasRemote === '1') {
          equipment.push({
            id: `eq-remote-${roomId}`,
            name: 'Controle Remoto',
            type: EquipmentType.REMOTE,
            status: EquipmentStatus.WORKING
          });
        }

        // Add other common equipment
        equipment.push({
          id: `eq-hdmi-${roomId}`,
          name: 'Cabo HDMI',
          type: EquipmentType.HDMI_CABLE,
          status: EquipmentStatus.WORKING
        });

        equipment.push({
          id: `eq-power-${roomId}`,
          name: 'Tomadas',
          type: EquipmentType.OUTLETS,
          status: EquipmentStatus.WORKING
        });

        // Create the room object
        roomsArray.push({
          id: roomId,
          name: roomName,
          number: roomNumber,
          towerId,
          floorNumber,
          wingId,
          capacity,
          status: RoomStatus.AVAILABLE,
          equipment,
          image: row.image || undefined
        });
      });

      // Call the callback with processed data
      onImportComplete(Array.from(towersMap.values()), roomsArray);
    } catch (err) {
      console.error('Erro ao processar arquivo CSV:', err);
      setError('Erro ao processar o arquivo CSV. Verifique o formato e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    if (!file) {
      setError('Nenhum arquivo selecionado');
      return;
    }

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Por favor, selecione um arquivo CSV válido');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const csvData = e.target?.result as string;
      processCSV(csvData);
    };
    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <FileCsv className="mx-auto h-12 w-12 text-gray-400" />
          <div>
            {isDragActive ? (
              <p className="text-primary font-medium">Solte o arquivo aqui...</p>
            ) : (
              <>
                <p className="font-medium">Clique aqui ou arraste um arquivo CSV</p>
                <p className="text-sm text-muted-foreground mt-1">
                  O arquivo deve estar no formato CSV com cabeçalhos
                </p>
              </>
            )}
          </div>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            <span>Selecionar Arquivo CSV</span>
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <div className="flex items-center justify-center p-4 text-primary">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Processando arquivo CSV...</span>
        </div>
      )}
    </div>
  );
};
