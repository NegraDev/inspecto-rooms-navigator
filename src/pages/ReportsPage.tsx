
import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { reports, inspectors } from '@/data/mockData';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  FileText, 
  Download, 
  Eye, 
  Clock, 
  Users, 
  AlertTriangle, 
  FileCheck,
  FileOutput,
  FileSpreadsheet,
  Calendar,
  CalendarDays,
  CalendarRange,
  BarChart,
  BarChart3,
  Activity,
  TrendingUp
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getTeamPerformance, 
  getInspectorPerformance, 
  dailyPerformance, 
  weeklyPerformance, 
  monthlyPerformance 
} from '@/data/performanceData';
import { PerformanceReport } from '@/types';
import { PerformanceCard } from '@/components/reports/PerformanceCard';
import { TeamPerformanceChart } from '@/components/reports/TeamPerformanceChart';
import { InspectorPerformanceChart } from '@/components/reports/InspectorPerformanceChart';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ReportsPage = () => {
  const { user, isSupervisor, isInspector } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("documents");
  const [performancePeriod, setPerformancePeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [inspectorPerformance, setInspectorPerformance] = useState<PerformanceReport[]>([]);
  const [previousPerformance, setPreviousPerformance] = useState<PerformanceReport | undefined>(undefined);

  useEffect(() => {
    if (user) {
      // Carregar dados de desempenho para o inspetor
      if (isInspector) {
        const performances = getInspectorPerformance(user.id, performancePeriod);
        setInspectorPerformance(performances);
        
        // Definir o desempenho anterior para comparações
        if (performances.length > 1) {
          setPreviousPerformance(performances[1]);
        } else {
          setPreviousPerformance(undefined);
        }
      }
    }
  }, [user, isInspector, performancePeriod]);

  const handleDownload = (reportId: string, format: 'pdf' | 'xlsx') => {
    // In a real app, this would trigger a download
    toast({
      title: `Relatório sendo baixado`,
      description: `O relatório será baixado em formato ${format.toUpperCase()}.`,
    });
  };

  // Obter dados de desempenho da equipe
  const teamPerformance = getTeamPerformance(performancePeriod);
  
  // Formatar a data do período selecionado
  const formatPeriodDate = (period: 'daily' | 'weekly' | 'monthly'): string => {
    const now = new Date();
    
    if (period === 'daily') {
      return format(now, "'Hoje', dd 'de' MMMM", { locale: ptBR });
    } else if (period === 'weekly') {
      return `Semana ${format(now, "w", { locale: ptBR })} - ${format(now, "MMMM", { locale: ptBR })}`;
    } else {
      return format(now, "MMMM 'de' yyyy", { locale: ptBR });
    }
  };
  
  return (
    <PageLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Relatórios</h1>
            <p className="text-muted-foreground">
              Visualize relatórios de inspeções e desempenho
            </p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full max-w-md mx-auto mb-4 grid grid-cols-2">
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Documentos</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Desempenho</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Conteúdo da aba de Documentos */}
          <TabsContent value="documents">
            <div className="flex justify-between mb-4">
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                <span>Gerar Novo Relatório</span>
              </Button>
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
          </TabsContent>
          
          {/* Conteúdo da aba de Desempenho */}
          <TabsContent value="performance">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Relatórios de Desempenho</h2>
              
              <Tabs defaultValue={performancePeriod} onValueChange={(value) => setPerformancePeriod(value as 'daily' | 'weekly' | 'monthly')} className="w-full">
                <TabsList className="w-full max-w-md mx-auto mb-4 grid grid-cols-3">
                  <TabsTrigger value="daily" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Diário</span>
                  </TabsTrigger>
                  <TabsTrigger value="weekly" className="flex items-center gap-2">
                    <CalendarRange className="h-4 w-4" />
                    <span>Semanal</span>
                  </TabsTrigger>
                  <TabsTrigger value="monthly" className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>Mensal</span>
                  </TabsTrigger>
                </TabsList>
                
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg">{formatPeriodDate(performancePeriod)}</CardTitle>
                    <CardDescription>
                      {isSupervisor ? 'Visão geral do desempenho da equipe' : 'Seu desempenho de inspeção'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Visão do supervisor - gráfico da equipe */}
                    {isSupervisor && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card className="bg-blue-50 border-blue-100">
                            <CardContent className="pt-6">
                              <div className="text-center">
                                <div className="text-sm font-medium text-blue-600 mb-1">Total de Inspeções</div>
                                <div className="text-3xl font-bold text-blue-700">{teamPerformance.totalInspections}</div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-amber-50 border-amber-100">
                            <CardContent className="pt-6">
                              <div className="text-center">
                                <div className="text-sm font-medium text-amber-600 mb-1">Problemas Identificados</div>
                                <div className="text-3xl font-bold text-amber-700">{teamPerformance.totalIssues}</div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-green-50 border-green-100">
                            <CardContent className="pt-6">
                              <div className="text-center">
                                <div className="text-sm font-medium text-green-600 mb-1">Eficiência Média</div>
                                <div className="text-3xl font-bold text-green-700">{teamPerformance.averageEfficiency}%</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <TeamPerformanceChart teamData={teamPerformance} />
                      </div>
                    )}
                    
                    {/* Visão do inspetor - seu desempenho */}
                    {isInspector && inspectorPerformance.length > 0 && (
                      <div className="space-y-6">
                        <PerformanceCard 
                          performance={inspectorPerformance[0]} 
                          previousPerformance={previousPerformance} 
                        />
                        
                        {inspectorPerformance.length > 1 && (
                          <InspectorPerformanceChart 
                            performanceData={inspectorPerformance} 
                            period={performancePeriod} 
                          />
                        )}
                      </div>
                    )}
                    
                    {isInspector && inspectorPerformance.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        <Activity className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>Não há dados de desempenho disponíveis para este período.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Lista de inspetores (apenas para supervisores) */}
                {isSupervisor && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Desempenho Individual</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {teamPerformance.inspectors.map(inspector => (
                        <PerformanceCard 
                          key={inspector.id} 
                          performance={inspector}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default ReportsPage;
