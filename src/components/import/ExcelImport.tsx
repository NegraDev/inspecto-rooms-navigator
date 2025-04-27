
import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tower, Wing, Room, EquipmentType, EquipmentStatus, RoomStatus, UserRole } from '@/types';
import { Badge } from '@/components/ui/badge';

type ExcelImportProps = {
  onImportComplete: (towers: Tower[], rooms: Room[]) => void;
};

export const ExcelImport: React.FC<ExcelImportProps> = ({ onImportComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
        setError('Por favor, selecione um arquivo Excel (.xlsx ou .xls)');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async () => {
    if (!file) {
      setError('Por favor, selecione um arquivo Excel para importar');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await readExcelFile(file);
      
      // Process the data
      const { towers, rooms } = processExcelData(data);
      
      // Call the callback with processed data
      onImportComplete(towers, rooms);
    } catch (err) {
      console.error('Error importing file:', err);
      setError('Ocorreu um erro ao processar o arquivo. Verifique se o formato está correto.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-1">Importar planilha de salas</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Selecione um arquivo Excel (.xlsx) contendo os dados das salas e torres
              </p>
              
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleUploadClick}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Selecionar Arquivo
                </Button>
                
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                <Button 
                  onClick={handleImport} 
                  disabled={!file || isLoading}
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="h-4 w-4" />
                      Importar Dados
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {file && (
              <Badge variant="outline" className="py-2 px-3 bg-gray-50">
                <FileSpreadsheet className="h-4 w-4 mr-2 text-blue-500" />
                {file.name}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="text-sm text-muted-foreground">
        <h4 className="font-medium text-foreground mb-2">Formato Esperado da Planilha:</h4>
        <p>O arquivo deve conter pelo menos as seguintes colunas:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Nome da Torre</li>
          <li>Ala</li>
          <li>Número do Andar</li>
          <li>Número da Sala</li>
          <li>Nome da Sala</li>
          <li>Capacidade</li>
          <li>Equipamentos (opcional)</li>
        </ul>
      </div>
    </div>
  );
};

// Lê o arquivo Excel e retorna os dados
const readExcelFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet);
        resolve(json as any[]);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsBinaryString(file);
  });
};

// Processa os dados do Excel para o formato esperado
const processExcelData = (data: any[]): { towers: Tower[], rooms: Room[] } => {
  const towers: Map<string, Tower> = new Map();
  const wings: Map<string, Wing> = new Map();
  const rooms: Room[] = [];
  
  // Gerar IDs únicos
  const generateId = () => Math.random().toString(36).substring(2, 11);
  
  data.forEach((row, index) => {
    // Extrai dados da linha
    const towerName = row.Torre || `Torre ${index % 2 === 0 ? 'A' : 'B'}`;
    const towerId = `t${towerName.charAt(towerName.length - 1).toLowerCase()}`;
    const wingName = row.Ala || `Ala ${Math.floor(Math.random() * 3) + 1}`;
    const wingId = `w-${towerId}-${wingName.charAt(wingName.length - 1).toLowerCase()}`;
    const floorNumber = row.Andar || Math.floor(Math.random() * 10) + 1;
    const roomNumber = row.Numero || `${floorNumber}${String.fromCharCode(65 + Math.floor(Math.random() * 10))}`;
    const roomName = row.Nome || `Sala ${roomNumber}`;
    const capacity = row.Capacidade || Math.floor(Math.random() * 30) + 5;
    
    // Processa torre
    if (!towers.has(towerId)) {
      towers.set(towerId, {
        id: towerId,
        name: towerName,
        floors: Array.from({ length: 15 }, (_, i) => i + 1),
        wings: []
      });
    }
    
    // Processa ala
    if (!wings.has(wingId)) {
      const wing: Wing = {
        id: wingId,
        name: wingName,
        towerId: towerId,
        floorNumber: floorNumber
      };
      
      wings.set(wingId, wing);
      
      const tower = towers.get(towerId);
      if (tower && !tower.wings.some(w => w.id === wingId)) {
        tower.wings.push(wing);
      }
    }
    
    // Gera uma lista aleatória de equipamentos
    const equipmentList = generateRandomEquipment();
    
    // Cria a sala
    const room: Room = {
      id: generateId(),
      name: roomName,
      number: roomNumber,
      towerId: towerId,
      floorNumber: floorNumber,
      wingId: wingId,
      capacity: capacity,
      equipment: equipmentList,
      status: [RoomStatus.AVAILABLE, RoomStatus.INSPECTION_NEEDED, RoomStatus.INSPECTED][Math.floor(Math.random() * 3)]
    };
    
    rooms.push(room);
  });
  
  return {
    towers: Array.from(towers.values()),
    rooms
  };
};

// Gera equipamentos aleatórios para uma sala
const generateRandomEquipment = (): { id: string; type: EquipmentType; name: string; status: EquipmentStatus; }[] => {
  const equipment = [];
  const equipmentTypes = Object.values(EquipmentType);
  const statuses = Object.values(EquipmentStatus);
  
  // Sempre inclui uma TV
  equipment.push({
    id: Math.random().toString(36).substring(2, 9),
    type: EquipmentType.TV,
    name: "TV Samsung 55\"",
    status: EquipmentStatus.WORKING
  });
  
  // Inclui alguns equipamentos aleatórios
  const numEquipment = Math.floor(Math.random() * 4) + 2; // 2-5 equipamentos
  
  for (let i = 0; i < numEquipment; i++) {
    const type = equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)];
    
    if (!equipment.some(e => e.type === type)) {
      equipment.push({
        id: Math.random().toString(36).substring(2, 9),
        type: type,
        name: getEquipmentName(type),
        status: statuses[Math.floor(Math.random() * statuses.length)]
      });
    }
  }
  
  return equipment;
};

// Retorna um nome para cada tipo de equipamento
const getEquipmentName = (type: EquipmentType): string => {
  switch (type) {
    case EquipmentType.TV:
      return "Smart TV 55\"";
    case EquipmentType.REMOTE:
      return "Controle remoto Samsung";
    case EquipmentType.BATTERIES:
      return "Pilhas AA";
    case EquipmentType.HDMI_CABLE:
      return "Cabo HDMI 2.0";
    case EquipmentType.MTR:
      return "MTR Conference";
    case EquipmentType.SWITCH_CABLE_HUB:
      return "Hub de conexões";
    case EquipmentType.MTOUCH:
      return "MTouch Controller";
    case EquipmentType.OUTLETS:
      return "Conjunto de tomadas";
    case EquipmentType.FILTER:
      return "Filtro de linha";
    case EquipmentType.MICROPHONE:
      return "Microfone de mesa";
    case EquipmentType.SPEAKER:
      return "Caixa de som JBL";
    default:
      return "Equipamento desconhecido";
  }
};
