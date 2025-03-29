
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, FileSpreadsheet, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tower, Room, RoomStatus, EquipmentType, EquipmentStatus } from '@/types';
import { Separator } from '@/components/ui/separator';

interface ExcelImportProps {
  onImportComplete: (towers: Tower[], rooms: Room[]) => void;
}

export const ExcelImport: React.FC<ExcelImportProps> = ({ onImportComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      handleFilePreview(e.target.files[0]);
    }
  };

  const handleFilePreview = async (file: File) => {
    try {
      const data = await readExcelFile(file);
      setPreviewData(data.slice(0, 5)); // Show only first 5 rows as preview
    } catch (err) {
      setError('Não foi possível ler o arquivo para prévia. Verifique o formato.');
      setPreviewData(null);
    }
  };

  const readExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          resolve(json);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  };

  const processExcelData = async () => {
    if (!file) return;
    
    setImporting(true);
    setError(null);
    
    try {
      const data = await readExcelFile(file);
      
      // Este é um exemplo de processamento - ajuste conforme seu formato de Excel específico
      // Assumindo que o Excel tem colunas como: Torre, Andar, Numero, Nome, Capacidade, Videoconferencia, etc.
      
      // Processando torres
      const towersMap = new Map<string, Tower>();
      const roomsData: Room[] = [];
      
      data.forEach((row: any) => {
        // Extraindo informações da torre
        const towerName = row.Torre || '';
        const towerIdRaw = towerName.includes('A') ? 't1' : 't2';
        const towerFloors = towerIdRaw === 't1' ? 20 : 14;
        
        // Garantindo que a torre existe no mapa
        if (!towersMap.has(towerIdRaw)) {
          towersMap.set(towerIdRaw, {
            id: towerIdRaw,
            name: towerName,
            floors: towerFloors,
            wings: [
              { id: `w1-${towerIdRaw}`, name: "Ala Norte", towerId: towerIdRaw },
              { id: `w2-${towerIdRaw}`, name: "Ala Sul", towerId: towerIdRaw }
            ]
          });
        }
        
        // Extraindo informações da sala
        const floorNumber = parseInt(row.Andar || '1');
        const roomNumber = row.Numero || '';
        const roomName = row.Nome || `Sala ${roomNumber}`;
        const capacity = parseInt(row.Capacidade || '10');
        const hasVideoConference = row.Videoconferencia === 'Sim';
        const wingId = (row.Ala || '').toLowerCase().includes('norte') 
          ? `w1-${towerIdRaw}` 
          : `w2-${towerIdRaw}`;
        
        // Gerando ID único para a sala
        const roomId = `room-${towerIdRaw}-${floorNumber}-${wingId}-${roomNumber}`;
        
        // Criando equipamentos baseado nas informações
        const equipment = [
          {
            id: `eq-${roomId}-1`,
            type: EquipmentType.AC,
            name: "AC 1",
            status: EquipmentStatus.WORKING,
            lastChecked: new Date().toISOString()
          },
          {
            id: `eq-${roomId}-2`,
            type: EquipmentType.LIGHT,
            name: "Luz 1",
            status: EquipmentStatus.WORKING,
            lastChecked: new Date().toISOString()
          }
        ];
        
        // Adicionando videoconferência se disponível
        if (hasVideoConference) {
          equipment.push({
            id: `eq-${roomId}-3`,
            type: EquipmentType.TV,
            name: "TV Videoconferência",
            status: EquipmentStatus.WORKING,
            lastChecked: new Date().toISOString()
          });
        }
        
        // Criando o objeto da sala
        const room: Room = {
          id: roomId,
          name: roomName,
          number: roomNumber,
          towerId: towerIdRaw,
          floorNumber,
          wingId,
          capacity,
          equipment,
          status: RoomStatus.AVAILABLE,
          lastInspection: undefined
        };
        
        roomsData.push(room);
      });
      
      // Convertendo o mapa de torres para um array
      const towersData = Array.from(towersMap.values());
      
      // Chamando o callback com os dados processados
      onImportComplete(towersData, roomsData);
      
      toast({
        title: "Importação concluída",
        description: `Foram importadas ${roomsData.length} salas de ${towersData.length} torres.`,
      });
      
    } catch (err) {
      setError('Erro ao processar o arquivo. Verifique se o formato está correto.');
      console.error(err);
    } finally {
      setImporting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-6 bg-background">
        <h3 className="text-lg font-medium mb-4">Importar Dados do Excel</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="flex-1"
            />
            <Button 
              onClick={processExcelData} 
              disabled={!file || importing}
              className="flex items-center gap-2"
            >
              {importing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Importar
            </Button>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
          
          {file && (
            <div className="px-4 py-2 bg-muted rounded flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
              <span>{file.name}</span>
            </div>
          )}
        </div>
        
        {previewData && previewData.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Prévia dos dados:</h4>
            <div className="border rounded overflow-auto max-h-64">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                  <tr>
                    {Object.keys(previewData[0]).map((key) => (
                      <th key={key} className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  {previewData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.values(row).map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-3 py-2 text-xs">
                          {String(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Mostrando {previewData.length} de {file ? 'aproximadamente ' + Math.ceil(file.size / 1000) + ' registros' : '0'}.
            </p>
          </div>
        )}
      </div>
      
      <div className="border rounded-lg p-6 bg-background">
        <h3 className="text-lg font-medium mb-2">Instruções de Formato</h3>
        <p className="text-sm text-muted-foreground mb-4">
          O arquivo Excel deve conter as seguintes colunas:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">Torre:</span>
              <span className="text-sm text-muted-foreground">Nome da torre (A ou B)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">Andar:</span>
              <span className="text-sm text-muted-foreground">Número do andar</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">Numero:</span>
              <span className="text-sm text-muted-foreground">Número da sala</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">Nome:</span>
              <span className="text-sm text-muted-foreground">Nome da sala (opcional)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">Capacidade:</span>
              <span className="text-sm text-muted-foreground">Capacidade da sala</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">Videoconferencia:</span>
              <span className="text-sm text-muted-foreground">Sim ou Não</span>
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="text-sm text-muted-foreground">
          <p className="mb-2">Exemplo de formato:</p>
          <pre className="bg-muted p-2 rounded text-xs overflow-auto">
            {`Torre | Andar | Numero | Nome         | Capacidade | Videoconferencia
A     | 1     | 101    | Sala 101     | 15         | Sim
A     | 1     | 102    | Sala Reunião | 8          | Não
B     | 5     | 512    | Auditório    | 50         | Sim`}
          </pre>
        </div>
      </div>
    </div>
  );
};
