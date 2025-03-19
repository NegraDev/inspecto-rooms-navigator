
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { reports, inspectors } from '@/data/mockData';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Download, 
  Eye, 
  Clock, 
  Users, 
  AlertTriangle, 
  FileCheck,
  FileOutput,
  FileSpreadsheet 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

const ReportsPage = () => {
  const handleDownload = (reportId: string, format: 'pdf' | 'xlsx') => {
    // In a real app, this would trigger a download
    toast({
      title: `Relatório sendo baixado`,
      description: `O relatório será baixado em formato ${format.toUpperCase()}.`,
    });
  };
  
  return (
    <PageLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Relatórios</h1>
            <p className="text-muted-foreground">
              Visualize e exporte relatórios de inspeções
            </p>
          </div>
          
          <div>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              <span>Gerar Novo Relatório</span>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full max-w-md mx-auto mb-4 grid grid-cols-3">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              <span>Todos</span>
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Mensais</span>
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Semanais</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {reports.map(report => {
                const inspector = inspectors.find(i => i.id === report.inspectorId);
                
                return (
                  <Card key={report.id} className="border border-gray-100 bg-white shadow-subtle hover:shadow-elevation transition-all duration-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold">{report.title}</CardTitle>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{new Date(report.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-1">
                          <span className="text-xs text-muted-foreground">Salas Inspecionadas</span>
                          <div className="flex items-center gap-1">
                            <FileCheck className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">{report.roomsInspected}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-1">
                          <span className="text-xs text-muted-foreground">Problemas Encontrados</span>
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            <span className="font-medium">{report.issuesFound}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>Inspetor: {inspector?.name || "N/A"}</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-2 flex justify-between gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>Visualizar</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 bg-primary/5 text-primary border-primary/20"
                        onClick={() => handleDownload(report.id, 'pdf')}
                      >
                        <FileOutput className="h-4 w-4 mr-1" />
                        <span>PDF</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 bg-green-50 text-green-600 border-green-200"
                        onClick={() => handleDownload(report.id, 'xlsx')}
                      >
                        <FileSpreadsheet className="h-4 w-4 mr-1" />
                        <span>Excel</span>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="monthly">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {reports.filter(r => r.title.includes('Mensal')).map(report => {
                const inspector = inspectors.find(i => i.id === report.inspectorId);
                
                return (
                  <Card key={report.id} className="border border-gray-100 bg-white shadow-subtle hover:shadow-elevation transition-all duration-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold">{report.title}</CardTitle>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{new Date(report.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-1">
                          <span className="text-xs text-muted-foreground">Salas Inspecionadas</span>
                          <div className="flex items-center gap-1">
                            <FileCheck className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">{report.roomsInspected}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-1">
                          <span className="text-xs text-muted-foreground">Problemas Encontrados</span>
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            <span className="font-medium">{report.issuesFound}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>Inspetor: {inspector?.name || "N/A"}</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-2 flex justify-between gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>Visualizar</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 bg-primary/5 text-primary border-primary/20"
                        onClick={() => handleDownload(report.id, 'pdf')}
                      >
                        <FileOutput className="h-4 w-4 mr-1" />
                        <span>PDF</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 bg-green-50 text-green-600 border-green-200"
                        onClick={() => handleDownload(report.id, 'xlsx')}
                      >
                        <FileSpreadsheet className="h-4 w-4 mr-1" />
                        <span>Excel</span>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="weekly">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {reports.filter(r => r.title.includes('Semanal')).map(report => {
                const inspector = inspectors.find(i => i.id === report.inspectorId);
                
                return (
                  <Card key={report.id} className="border border-gray-100 bg-white shadow-subtle hover:shadow-elevation transition-all duration-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold">{report.title}</CardTitle>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{new Date(report.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-1">
                          <span className="text-xs text-muted-foreground">Salas Inspecionadas</span>
                          <div className="flex items-center gap-1">
                            <FileCheck className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">{report.roomsInspected}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-1">
                          <span className="text-xs text-muted-foreground">Problemas Encontrados</span>
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            <span className="font-medium">{report.issuesFound}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>Inspetor: {inspector?.name || "N/A"}</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-2 flex justify-between gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>Visualizar</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 bg-primary/5 text-primary border-primary/20"
                        onClick={() => handleDownload(report.id, 'pdf')}
                      >
                        <FileOutput className="h-4 w-4 mr-1" />
                        <span>PDF</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 bg-green-50 text-green-600 border-green-200"
                        onClick={() => handleDownload(report.id, 'xlsx')}
                      >
                        <FileSpreadsheet className="h-4 w-4 mr-1" />
                        <span>Excel</span>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default ReportsPage;
