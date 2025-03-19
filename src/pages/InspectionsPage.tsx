
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { inspections, rooms, inspectors } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ClipboardCheck, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Hourglass, 
  Image,
  User 
} from 'lucide-react';
import { InspectionStatus } from '@/types';

const InspectionsPage = () => {
  return (
    <PageLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Inspeções</h1>
            <p className="text-muted-foreground">
              Gerencie e acompanhe as inspeções realizadas
            </p>
          </div>
          
          <div>
            <Button asChild>
              <a href="/camera" className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4" />
                <span>Nova Inspeção</span>
              </a>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {inspections.map(inspection => {
            const room = rooms.find(r => r.id === inspection.roomId);
            const inspector = inspectors.find(i => i.id === inspection.inspectorId);
            
            if (!room || !inspector) return null;
            
            // Get status icon and color
            const getStatusIconAndColor = () => {
              switch (inspection.status) {
                case InspectionStatus.COMPLETED:
                  return { icon: <CheckCircle className="h-5 w-5 text-green-500" />, color: 'bg-green-50 border-green-200 text-green-700' };
                case InspectionStatus.ISSUES_FOUND:
                  return { icon: <AlertTriangle className="h-5 w-5 text-orange-500" />, color: 'bg-orange-50 border-orange-200 text-orange-700' };
                case InspectionStatus.IN_PROGRESS:
                  return { icon: <Hourglass className="h-5 w-5 text-blue-500" />, color: 'bg-blue-50 border-blue-200 text-blue-700' };
                case InspectionStatus.PENDING:
                  return { icon: <Clock className="h-5 w-5 text-gray-500" />, color: 'bg-gray-50 border-gray-200 text-gray-700' };
                default:
                  return { icon: <Clock className="h-5 w-5 text-gray-500" />, color: 'bg-gray-50 border-gray-200 text-gray-700' };
              }
            };
            
            const { icon, color } = getStatusIconAndColor();
            
            return (
              <Card key={inspection.id} className="border border-gray-100 shadow-subtle hover:shadow-elevation transition-all duration-300">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="md:w-1/3 p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center">
                          {icon}
                        </div>
                        
                        <div>
                          <h3 className="font-medium">{room.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {`Torre ${room.towerId === 't1' ? 'Norte' : 'Sul'} • Andar ${room.floorNumber}`}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-1/3 p-4 border-t md:border-t-0 md:border-l md:border-r border-gray-100">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Inspetor: <span className="font-medium">{inspector.name}</span></span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Data: <span className="font-medium">{new Date(inspection.date).toLocaleDateString('pt-BR')}</span></span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Image className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Fotos: <span className="font-medium">{inspection.photos.length}</span></span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-1/3 p-4 border-t md:border-t-0">
                      <div className="flex flex-col h-full">
                        <div>
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
                            {icon}
                            <span>
                              {
                                {
                                  [InspectionStatus.COMPLETED]: "Concluída",
                                  [InspectionStatus.ISSUES_FOUND]: "Problemas Encontrados",
                                  [InspectionStatus.IN_PROGRESS]: "Em Progresso",
                                  [InspectionStatus.PENDING]: "Pendente"
                                }[inspection.status]
                              }
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-3 text-sm">
                          <span className="font-medium">Notas:</span>
                          <p className="text-muted-foreground line-clamp-2">{inspection.notes}</p>
                        </div>
                        
                        <div className="mt-3 flex gap-2">
                          <Button variant="outline" size="sm">
                            Ver Detalhes
                          </Button>
                          
                          <Button variant="outline" size="sm" className="bg-primary/5 text-primary border-primary/20">
                            Gerar Relatório
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
};

export default InspectionsPage;
