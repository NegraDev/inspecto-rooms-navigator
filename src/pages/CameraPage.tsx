
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { CameraView } from '@/components/camera/CameraView';
import { rooms } from '@/data/mockData';
import { Room, Photo, EquipmentStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Check, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Define photo types that are required for inspection
enum RequiredPhotoType {
  DOOR_PLATE = 'door_plate',
  ENVIRONMENT = 'environment',
  EQUIPMENT = 'equipment' // HDMI/MTOuch/Microphone
}

// Extended Photo type to include required photo type
interface ExtendedPhoto extends Photo {
  photoType?: RequiredPhotoType;
  equipmentWorking?: boolean;
}

const CameraPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [photos, setPhotos] = useState<ExtendedPhoto[]>([]);
  
  // Track required photo types
  const [doorPlateTaken, setDoorPlateTaken] = useState(false);
  const [environmentTaken, setEnvironmentTaken] = useState(false);
  const [equipmentTaken, setEquipmentTaken] = useState(false);
  
  // Parse query params to get roomId
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const roomId = searchParams.get('roomId');
    
    if (roomId) {
      const foundRoom = rooms.find(r => r.id === roomId);
      if (foundRoom) {
        setRoom(foundRoom);
      }
    }
  }, [location.search]);
  
  const handlePhotoCaptured = (
    photoData: string, 
    caption: string, 
    equipmentId?: string, 
    photoType?: RequiredPhotoType,
    equipmentWorking: boolean = true
  ) => {
    const newPhoto: ExtendedPhoto = {
      id: `photo-${Date.now()}`,
      url: photoData,
      caption: caption || "",
      timestamp: new Date().toISOString(),
      type: 'equipment', // Adicionando o tipo padrão
      equipmentId,
      photoType,
      equipmentWorking
    };
    
    setPhotos(prev => [...prev, newPhoto]);
    
    // Track required photos
    if (photoType === RequiredPhotoType.DOOR_PLATE) {
      setDoorPlateTaken(true);
    } else if (photoType === RequiredPhotoType.ENVIRONMENT) {
      setEnvironmentTaken(true);
    } else if (photoType === RequiredPhotoType.EQUIPMENT) {
      setEquipmentTaken(true);
    }
  };
  
  const handleSaveInspection = () => {
    // Check for required photos
    if (!doorPlateTaken || !environmentTaken || !equipmentTaken) {
      toast({
        title: "Fotos obrigatórias pendentes",
        description: "Você precisa tirar todas as fotos obrigatórias antes de salvar a inspeção.",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would normally save the inspection to a database
    // For this demo, we'll just show a success toast
    
    toast({
      title: "Inspeção salva com sucesso",
      description: `Foram adicionadas ${photos.length} fotos à inspeção.`,
    });
    
    // Navigate back to room detail or to inspections list
    if (room) {
      navigate(`/rooms/${room.id}`);
    } else {
      navigate('/inspections');
    }
  };

  // Calculate how many required photos have been taken
  const totalRequiredPhotosTaken = [doorPlateTaken, environmentTaken, equipmentTaken].filter(Boolean).length;
  const allRequiredPhotosTaken = totalRequiredPhotosTaken === 3;
  
  return (
    <PageLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Voltar</span>
            </Button>
            
            <div>
              <h1 className="text-2xl font-bold">Câmera</h1>
              <p className="text-muted-foreground">
                {room 
                  ? `Inspecionando: ${room.name}`
                  : 'Capture fotos para inspeção'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-sm">
              <span className="font-medium">Fotos obrigatórias:</span>
              <span className={`ml-1 ${allRequiredPhotosTaken ? 'text-green-600' : 'text-orange-500'}`}>
                {totalRequiredPhotosTaken}/3
              </span>
            </div>
            
            <Button
              onClick={handleSaveInspection}
              className={`${photos.length > 0 ? 'bg-primary hover:bg-primary/90' : 'bg-gray-300 cursor-not-allowed'} text-white flex items-center gap-2`}
              disabled={photos.length === 0}
            >
              <Save className="h-4 w-4" />
              <span>Salvar Inspeção</span>
            </Button>
          </div>
        </div>

        {!allRequiredPhotosTaken && photos.length > 0 && (
          <Alert className="bg-amber-50 border-amber-200 text-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription>
              Você precisa tirar as 3 fotos obrigatórias antes de salvar a inspeção.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg overflow-hidden shadow-subtle border border-gray-100">
              <CameraView 
                room={room || undefined} 
                onPhotoCaptured={handlePhotoCaptured} 
              />
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-subtle border border-gray-100 p-4 h-full">
              <h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
                <span>Fotos Capturadas</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {photos.length} {photos.length === 1 ? 'foto' : 'fotos'}
                </span>
              </h2>
              
              {photos.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
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
                      className="text-muted-foreground"
                    >
                      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                      <circle cx="12" cy="13" r="3"/>
                    </svg>
                  </div>
                  <h3 className="text-base font-medium">Nenhuma foto ainda</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Use a câmera para capturar fotos da sala e equipamentos
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {photos.map(photo => {
                    const photoTypeLabel = photo.photoType && {
                      [RequiredPhotoType.DOOR_PLATE]: 'Porta/Placa',
                      [RequiredPhotoType.ENVIRONMENT]: 'Ambiente',
                      [RequiredPhotoType.EQUIPMENT]: 'Equipamento'
                    }[photo.photoType];
                    
                    return (
                      <div 
                        key={photo.id} 
                        className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <div className="w-20 h-20 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={photo.url} 
                            alt={photo.caption || "Foto capturada"} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-medium text-sm">
                                {photo.caption || "Sem descrição"}
                              </div>
                              {photoTypeLabel && (
                                <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                                  {photoTypeLabel}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(photo.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                          
                          {photo.equipmentId && room && (
                            <div className="mt-1">
                              <div className="text-xs text-muted-foreground">
                                Equipamento: {
                                  room.equipment.find(e => e.id === photo.equipmentId)?.name ||
                                  "Desconhecido"
                                }
                              </div>
                              
                              {photo.equipmentWorking !== undefined && (
                                <div className="mt-1">
                                  <span 
                                    className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                                      photo.equipmentWorking 
                                        ? 'text-green-600 bg-green-50' 
                                        : 'text-red-600 bg-red-50'
                                    }`}
                                  >
                                    {photo.equipmentWorking ? (
                                      <>
                                        <Check className="h-3 w-3" />
                                        <span>Funcionando</span>
                                      </>
                                    ) : (
                                      <>
                                        <AlertTriangle className="h-3 w-3" />
                                        <span>Com defeito</span>
                                      </>
                                    )}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="mt-2">
                            <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                              <Check className="h-3 w-3" />
                              <span>Salva</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CameraPage;
