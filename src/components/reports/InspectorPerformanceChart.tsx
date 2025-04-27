
import React from 'react';
import { PerformanceReport } from '@/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface InspectorPerformanceChartProps {
  performanceData: PerformanceReport[];
  period: 'daily' | 'weekly' | 'monthly';
}

export const InspectorPerformanceChart: React.FC<InspectorPerformanceChartProps> = ({ 
  performanceData,
  period
}) => {
  // Formatar data para exibição
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (period === 'daily') {
      return format(date, 'dd/MM', { locale: ptBR });
    } else if (period === 'weekly') {
      return `Sem ${format(date, 'w', { locale: ptBR })}`;
    } else {
      return format(date, 'MMM/yy', { locale: ptBR });
    }
  };

  // Organizar dados para o gráfico
  const chartData = performanceData
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(report => ({
      date: formatDate(report.date),
      inspeções: report.inspectionsCompleted,
      problemas: report.issuesIdentified,
      eficiência: report.efficiency || 0,
    }));

  const chartConfig = {
    inspeções: {
      label: 'Inspeções',
      color: '#3b82f6',
    },
    problemas: {
      label: 'Problemas',
      color: '#f97316',
    },
    eficiência: {
      label: 'Eficiência (%)',
      color: '#10b981',
    },
  };

  return (
    <ChartContainer className="mt-6 h-80" config={chartConfig}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="inspeções"
            stroke="#3b82f6"
            activeDot={{ r: 8 }}
            name="Inspeções"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="problemas"
            stroke="#f97316"
            name="Problemas"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="eficiência"
            stroke="#10b981"
            name="Eficiência (%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
