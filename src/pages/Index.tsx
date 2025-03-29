import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Grid3X3, 
  Users, 
  FileText, 
  ClipboardCheck, 
  ChevronRight,
  Camera,
  FileInput,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { towers, rooms, inspectors, inspections } from '@/data/mockData';
import { RoomCard } from '@/components/room/RoomCard';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  // Get some stats for the dashboard
  const totalRooms = rooms.length;
  const inspectedRooms = rooms.filter(room => room.lastInspection).length;
  const percentageInspected = Math.round((inspectedRooms / totalRooms) * 100);
  
  // Usar o contexto de autenticação
  const { user, isAdmin } = useAuth();
  
  return (
    <PageLayout>
      <div className="space-y-8 animate-fade-in">
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Bem-vindo ao Inspecto Rooms, {user?.name}</h1>
              <p className="text-muted-foreground">Gerencie e inspecione salas com facilidade</p>
            </div>
            
            <div className="flex gap-2">
              <Button asChild>
                <Link to="/camera" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  <span>Nova Inspeção</span>
                </Link>
              </Button>
              
              {isAdmin && (
                <Button asChild variant="outline">
                  <Link to="/import" className="flex items-center gap-2">
                    <FileInput className="h-4 w-4" />
                    <span>Importar Dados</span>
                  </Link>
                </Button>
              )}
              
              <Button asChild variant="outline">
                <Link to="/reports" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Relatórios</span>
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-gray-100 shadow-subtle transition-all duration-300 hover:shadow-elevation">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Torres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">{towers.length}</div>
                <Button variant="ghost" size="icon" className="rounded-full bg-primary/10 text-primary h-9 w-9">
                  <Building className="h-5 w-5" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Total de torres disponíveis
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-100 shadow-subtle transition-all duration-300 hover:shadow-elevation">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Salas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">{totalRooms}</div>
                <Button variant="ghost" size="icon" className="rounded-full bg-blue-50 text-blue-600 h-9 w-9">
                  <Grid3X3 className="h-5 w-5" />
                </Button>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Inspecionadas</span>
                  <span className="font-medium">{percentageInspected}%</span>
                </div>
                <Progress value={percentageInspected} className="h-1.5" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-100 shadow-subtle transition-all duration-300 hover:shadow-elevation">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Inspeções</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">{inspections.length}</div>
                <Button variant="ghost" size="icon" className="rounded-full bg-green-50 text-green-600 h-9 w-9">
                  <ClipboardCheck className="h-5 w-5" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Total de inspeções realizadas
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-100 shadow-subtle transition-all duration-300 hover:shadow-elevation">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Inspetores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">{inspectors.length}</div>
                <Button variant="ghost" size="icon" className="rounded-full bg-purple-50 text-purple-600 h-9 w-9">
                  <Users className="h-5 w-5" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Inspetores ativos no sistema
              </div>
            </CardContent>
          </Card>
        </section>
        
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Inspeções Recentes</h2>
            <Button variant="link" asChild>
              <Link to="/inspections" className="flex items-center gap-1">
                <span>Ver todas</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {inspections.map(inspection => {
              const room = rooms.find(r => r.id === inspection.roomId);
              const inspector = inspectors.find(i => i.id === inspection.inspectorId);
              
              if (!room || !inspector) return null;
              
              return (
                <Card key={inspection.id} className="border border-gray-100 shadow-subtle hover:shadow-elevation transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="mb-3 flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{room.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {`Torre ${room.towerId === 't1' ? 'Norte' : 'Sul'} • Andar ${room.floorNumber}`}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(inspection.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Inspetor:</span> {inspector.name}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Notas:</span> {inspection.notes}
                      </div>
                      
                      {inspection.photos.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {inspection.photos.map(photo => (
                            <img 
                              key={photo.id}
                              src={photo.url} 
                              alt={photo.caption || "Foto da inspeção"} 
                              className="h-16 w-16 object-cover rounded-md border border-gray-200"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
        
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Salas em Destaque</h2>
            <Button variant="link" asChild>
              <Link to="/rooms" className="flex items-center gap-1">
                <span>Ver todas</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rooms.slice(0, 4).map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Index;
