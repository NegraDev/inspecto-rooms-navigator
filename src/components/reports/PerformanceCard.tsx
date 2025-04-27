
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PerformanceReport } from '@/types';
import { Activity, Clock, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PerformanceCardProps {
  performance: PerformanceReport;
  previousPerformance?: PerformanceReport;
}

export const PerformanceCard: React.FC<PerformanceCardProps> = ({ 
  performance,
  previousPerformance
}) => {
  // Calcular variações em relação ao período anterior
  const calculateChange = (current: number, previous?: number): { value: number, increase: boolean } => {
    if (!previous) return { value: 0, increase: false };
    const change = Math.round(((current - previous) / previous) * 100);
    return { value: Math.abs(change), increase: change > 0 };
  };

  const inspectionsChange = calculateChange(
    performance.inspectionsCompleted, 
    previousPerformance?.inspectionsCompleted
  );
  
  const efficiencyChange = calculateChange(
    performance.efficiency, 
    previousPerformance?.efficiency
  );

  const formatDate = (date: string, period: "daily" | "weekly" | "monthly"): string => {
    const dateObj = new Date(date);
    if (period === 'daily') {
      return format(dateObj, "dd 'de' MMMM", { locale: ptBR });
    } else if (period === 'weekly') {
      return `Semana ${format(dateObj, "w", { locale: ptBR })} - ${format(dateObj, "MMMM", { locale: ptBR })}`;
    } else {
      return format(dateObj, "MMMM 'de' yyyy", { locale: ptBR });
    }
  };

  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span>
            {performance.period === 'daily' && 'Desempenho Diário'}
            {performance.period === 'weekly' && 'Desempenho Semanal'}
            {performance.period === 'monthly' && 'Desempenho Mensal'}
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {formatDate(performance.date, performance.period)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Activity className="h-4 w-4 mr-1" />
              <span>Inspeções</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">{performance.inspectionsCompleted}</div>
              {previousPerformance && (
                <div className={`flex items-center text-xs ${inspectionsChange.increase ? 'text-green-600' : 'text-red-600'}`}>
                  {inspectionsChange.increase ? 
                    <ArrowUpRight className="h-3 w-3 mr-1" /> : 
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  }
                  <span>{inspectionsChange.value}%</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>Problemas Identificados</span>
            </div>
            <div className="text-xl font-bold">{performance.issuesIdentified}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>Tempo Médio</span>
            </div>
            <div className="text-xl font-bold">{performance.averageTimePerInspection ?? performance.averageTime} min</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Activity className="h-4 w-4 mr-1" />
              <span>Eficiência</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">{performance.efficiency}%</div>
              {previousPerformance && (
                <div className={`flex items-center text-xs ${efficiencyChange.increase ? 'text-green-600' : 'text-red-600'}`}>
                  {efficiencyChange.increase ? 
                    <ArrowUpRight className="h-3 w-3 mr-1" /> : 
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  }
                  <span>{efficiencyChange.value}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
