
import React, { useState, useRef } from 'react';
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
  Battery
} from 'lucide-react';
import { Room, Equipment, EquipmentType } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

interface CameraViewProps {
  room?: Room;
  onPhotoCaptured: (photoData: string, caption: string, equipmentId?: string) => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ room, onPhotoCaptured }) => {
  const [activeTab, setActiveTab] = useState('camera');
  const [streaming, setStreaming] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [noteText, setNoteText] = useState('');
  
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
      
      // Set canvas dimensions to match video
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      
      // Draw video frame to canvas
      context?.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      
      // Convert canvas to data URL
      const photoData = canvasRef.current.toDataURL('image/png');
      
      // Display the photo
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
      onPhotoCaptured(
        photoRef.current.src, 
        noteText,
        selectedEquipment ? selectedEquipment.id : undefined
      );
      
      // Reset the state
      setPhotoTaken(false);
      setNoteText('');
      setSelectedEquipment(null);
      
      toast({
        title: "Foto salva com sucesso",
        description: "A foto foi adicionada à inspeção.",
      });
    }
  };
  
  const handleEquipmentSelect = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
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
  
  React.useEffect(() => {
    // Auto-start camera when component mounts and tab is 'camera'
    if (activeTab === 'camera') {
      startCamera();
    }
    
    // Clean up on component unmount
    return () => {
      stopCamera();
    };
  }, [activeTab]);
  
  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="camera" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="camera" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            <span>Câmera</span>
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <UploadCloud className="h-4 w-4" />
            <span>Upload</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="camera" className="flex-1">
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
                      <p className="text-xs opacity-80">{`Andar ${room.floorNumber} • ${selectedEquipment ? selectedEquipment.name : 'Visão geral'}`}</p>
                    </div>
                    
                    {selectedEquipment && (
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/10">
                        {getEquipmentIcon(selectedEquipment.type, 18)}
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
            </div>
          )}
          
          {room && !photoTaken && (
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
        
        <TabsContent value="upload">
          <div className="p-8 border-2 border-dashed border-gray-200 rounded-md bg-gray-50 flex flex-col items-center justify-center text-center">
            <UploadCloud className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">Arraste e solte uma imagem</h3>
            <p className="text-sm text-muted-foreground mb-4">Ou clique para selecionar um arquivo</p>
            
            <Button variant="outline" className="bg-white">
              <UploadCloud className="h-4 w-4 mr-2" />
              <span>Selecionar arquivo</span>
              <Input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
