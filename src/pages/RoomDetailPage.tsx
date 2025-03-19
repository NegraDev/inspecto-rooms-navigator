
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { RoomDetail } from '@/components/room/RoomDetail';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { rooms } from '@/data/mockData';
import { Room } from '@/types';

const RoomDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    
    setTimeout(() => {
      if (id) {
        const foundRoom = rooms.find(r => r.id === id);
        setRoom(foundRoom || null);
      }
      setLoading(false);
    }, 500);
  }, [id]);
  
  return (
    <PageLayout>
      <div className="space-y-6 animate-fade-in">
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
            <h1 className="text-2xl font-bold">Detalhes da Sala</h1>
            <p className="text-muted-foreground">
              Informações detalhadas e status da sala
            </p>
          </div>
        </div>
        
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-10 w-10"></div>
              <div className="flex-1 space-y-6 py-1">
                <div className="h-2 bg-gray-200 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-gray-200 rounded col-span-2"></div>
                    <div className="h-2 bg-gray-200 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ) : room ? (
          <RoomDetail room={room} />
        ) : (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            Sala não encontrada. Verifique o ID da sala e tente novamente.
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default RoomDetailPage;
