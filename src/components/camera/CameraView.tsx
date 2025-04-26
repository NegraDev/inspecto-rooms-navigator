import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Camera, 
  UploadCloud, 
  Image as ImageIcon, 
  Check, 
  X, 
  Lightbulb, 
  Tv, 
  Cable, 
  DoorClosed, 
  Power, 
  Filter, 
  Wind, 
  MessageSquare,
  Volume2,
  Radio,
  Battery,
  AlertTriangle
} from 'lucide-react';
import { Room, Equipment, EquipmentType } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

enum RequiredPhotoType {
  DOOR_PLATE = 'door_plate',
  ENVIRONMENT = 'environment',
  EQUIPMENT = 'equipment'
}

interface RequiredPhoto {
  type: RequiredPhotoType;
  label: string;
  description: string;
  taken: boolean;
  photoId?: string;
}

interface CameraViewProps {
  room?: Room;
  onPhotoCaptured: (photoData: string, caption: string, equipmentId?: string, photoType?: RequiredPhotoType, equipmentWorking?: boolean) => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ room, onPhotoCaptured }) => {
  const [activeTab, setActiveTab] = useState('camera');
  const [streaming, setStreaming] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [noteText, setNoteText] = useState('');
  const [equipmentWorking, setEquipmentWorking] = useState(true);
  const [selectedPhotoType, setSelectedPhotoType] = useState<RequiredPhotoType | null>(null);
  
  const [requiredPhotos, setRequiredPhotos] = useState<RequiredPhoto[]>([
    { 
      type: RequiredPhotoType.DOOR_PLATE, 
      label: 'Porta/Placa', 
      description: 'Foto da porta e placa de identificação da sala',
      taken: false
    },
    { 
      type: RequiredPhotoType.ENVIRONMENT, 
      label: 'Ambiente Geral', 
      description: 'Visão geral do ambiente da sala',
      taken: false
    },
    { 
      type: RequiredPhotoType.EQUIPMENT, 
      label: 'HDMI/MTOuch/Microfone', 
      description: 'Detalhes dos equipamentos principais',
      taken: false
    }
  ]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      toast({
        title: "Erro ao acessar câmera",
        description: "Verifique se você concedeu permissão para acessar a câmera.",
        variant: "destructive"
      });
    }
  };
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setStreaming(false);
    }
  };
  
  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      
      context?.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      
      const photoData = canvasRef.current.toDataURL('image/png');
      
      if (photoRef.current) {
        photoRef.current.src = photoData;
        setPhotoTaken(true);
      }
    }
  };
  
  const retakePhoto = () => {
    setPhotoTaken(false);
  };
  
  const savePhoto = () => {
    if (photoRef.current && photoRef.current.src) {
      if (selectedEquipment && !equipmentWorking && !photoTaken) {
        toast({
          title: "Foto Obrigatória",
          description: "É necessário tirar uma foto do equipamento com defeito.",
          variant: "destructive"
        });
        return;
      }

      const photoId = `photo-${Date.now()}`;
      
      onPhotoCaptured(
        photoRef.current.src, 
        noteText,
        selectedEquipment ? selectedEquipment.id : undefined,
        selectedPhotoType,
        equipmentWorking
      );
      
      if (selectedPhotoType) {
        setRequiredPhotos(prev => prev.map(photo => 
          photo.type === selectedPhotoType 
            ? { ...photo, taken: true, photoId } 
            : photo
        ));
      }
      
      setPhotoTaken(false);
      setNoteText('');
      
      if (!selectedPhotoType) {
        setSelectedEquipment(null);
      }
      
      setSelectedPhotoType(null);
      
      toast({
        title: "Foto salva com sucesso",
        description: "A foto foi adicionada à inspeção.",
      });
    }
  };
  
  const handleEquipmentSelect = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setSelectedPhotoType(null);
  };

  const handleRequiredPhotoSelect = (photoType: RequiredPhotoType) => {
    setSelectedPhotoType(photoType);
    
    if (photoType !== RequiredPhotoType.EQUIPMENT) {
      setSelectedEquipment(null);
    }
  };
  
  const getEquipmentIcon = (type: EquipmentType, size = 16) => {
    switch (type) {
      case EquipmentType.TV:
        return <Tv width={size} height={size} />;
      case EquipmentType.REMOTE:
        return <Radio width={size} height={size} />;
      case EquipmentType.BATTERIES:
        return <Battery width={size} height={size} />;
      case EquipmentType.HDMI_CABLE:
        return <Cable width={size} height={size} />;
      case EquipmentType.MTR:
        return <Tv width={size} height={size} />;
      case EquipmentType.SWITCH_CABLE_HUB:
        return <Cable width={size} height={size} />;
      case EquipmentType.MTOUCH:
        return <Radio width={size} height={size} />;
      case EquipmentType.OUTLETS:
        return <Power width={size} height={size} />;
      case EquipmentType.FILTER:
        return <Filter width={size} height={size} />;
      case EquipmentType.MICROPHONE:
        return <Radio width={size} height={size} />;
      case EquipmentType.SPEAKER:
        return <Volume2 width={size} height={size} />;
      default:
        return null;
    }
  };

  const getRequiredPhotoIcon = (type: RequiredPhotoType, size = 16) => {
    switch (type) {
      case RequiredPhotoType.DOOR_PLATE:
        return <DoorClosed width={size} height={size} />;
      case RequiredPhotoType.ENVIRONMENT:
        return <ImageIcon width={size} height={size} />;
      case RequiredPhotoType.EQUIPMENT:
        return <Cable width={size} height={size} />;
      default:
        return null;
    }
  };

  const completedPhotos = requiredPhotos.filter(p => p.taken).length;
  const totalRequiredPhotos = requiredPhotos.length;
  
  React.useEffect(() => {
    if (activeTab === 'camera') {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [activeTab]);
  
  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="camera" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-1">
          <TabsTrigger value="camera" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            <span>Câmera</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="camera" className="flex-1">
          <div className="bg-gray-100 p-2 mb-3 rounded-md">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Fotos Obrigatórias</h3>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md">
                {completedPhotos}/{totalRequiredPhotos}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-2">
              {requiredPhotos.map((photo) => (
                <Button
                  key={photo.type}
                  onClick={() => handleRequiredPhotoSelect(photo.type)}
                  variant={photo.taken ? "default" : "outline"}
                  className={`h-auto py-2 justify-start flex-col items-start ${
                    selectedPhotoType === photo.type ? 'ring-2 ring-primary' : ''
                  } ${
                    photo.taken 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center w-full justify-between mb-1">
                    <span className="flex items-center">
                      {getRequiredPhotoIcon(photo.type)}
                      <span className="ml-1 text-sm">{photo.label}</span>
                    </span>
                    {photo.taken && <Check className="h-4 w-4" />}
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="relative bg-black rounded-md overflow-hidden aspect-[3/4] mb-4">
            {!photoTaken ? (
              <>
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {room && (
                  <div className="absolute top-0 left-0 right-0 bg-black/50 backdrop-blur-sm text-white p-3 flex items-center">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{room.name}</h3>
                      <p className="text-xs opacity-80">
                        {`Andar ${room.floorNumber} • ${
                          selectedPhotoType 
                            ? requiredPhotos.find(p => p.type === selectedPhotoType)?.label 
                            : selectedEquipment 
                              ? selectedEquipment.name 
                              : 'Visão geral'
                        }`}
                      </p>
                    </div>
                    
                    {selectedEquipment && (
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/10">
                        {getEquipmentIcon(selectedEquipment.type, 18)}
                      </div>
                    )}
                    
                    {selectedPhotoType && !selectedEquipment && (
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/10">
                        {getRequiredPhotoIcon(selectedPhotoType, 18)}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="absolute inset-0 border-2 border-white/20 pointer-events-none"></div>
                
                <Button 
                  onClick={capturePhoto}
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-black hover:bg-white/90 h-14 w-14 rounded-full p-0 flex items-center justify-center"
                >
                  <span className="sr-only">Tirar foto</span>
                  <div className="h-10 w-10 rounded-full border-2 border-black"></div>
                </Button>
              </>
            ) : (
              <>
                <img
                  ref={photoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Captured"
                />
                
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                  <Button 
                    onClick={retakePhoto}
                    variant="outline" 
                    size="icon" 
                    className="bg-white/90 text-black hover:bg-white h-12 w-12 rounded-full"
                  >
                    <X className="h-6 w-6" />
                    <span className="sr-only">Tentar novamente</span>
                  </Button>
                  
                  <Button 
                    onClick={savePhoto}
                    variant="outline" 
                    size="icon" 
                    className="bg-primary text-white hover:bg-primary/90 h-12 w-12 rounded-full"
                  >
                    <Check className="h-6 w-6" />
                    <span className="sr-only">Salvar foto</span>
                  </Button>
                </div>
              </>
            )}
          </div>
          
          <canvas ref={canvasRef} className="hidden" />
          
          {photoTaken && (
            <div className="mb-4 space-y-3">
              <div className="space-y-2">
                <Label htmlFor="photo-note">Nota</Label>
                <div className="flex gap-2">
                  <Textarea 
                    id="photo-note" 
                    placeholder="Adicione uma nota para esta foto..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="resize-none"
                  />
                </div>
              </div>
              
              {selectedEquipment && (
                <div className="flex items-center justify-between">
                  <Label htmlFor="equipment-working">Equipamento funcionando:</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="equipment-working"
                      checked={equipmentWorking}
                      onCheckedChange={setEquipmentWorking}
                    />
                    <span className={equipmentWorking ? "text-green-600" : "text-red-600"}>
                      {equipmentWorking ? "Sim" : "Não"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {room && !photoTaken && !selectedPhotoType && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Selecione um equipamento</span>
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <Button
                  onClick={() => setSelectedEquipment(null)}
                  variant="outline"
                  className={`justify-start ${selectedEquipment === null ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  <span>Visão geral</span>
                </Button>
                
                {room.equipment.map(equipment => (
                  <Button
                    key={equipment.id}
                    onClick={() => handleEquipmentSelect(equipment)}
                    variant="outline"
                    className={`justify-start ${selectedEquipment?.id === equipment.id ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                  >
                    {getEquipmentIcon(equipment.type)}
                    <span className="ml-2 text-sm truncate">{equipment.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
