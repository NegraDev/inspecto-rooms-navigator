
import React from 'react';
import { TeamPerformance } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { ChartContainer } from '@/components/ui/chart';

interface TeamPerformanceChartProps {
  teamData: TeamPerformance;
}

export const TeamPerformanceChart: React.FC<TeamPerformanceChartProps> = ({ teamData }) => {
  const chartData = teamData.inspectors.map(inspector => ({
    name: inspector.inspectorName,
    inspeções: inspector.inspectionsCompleted,
    problemas: inspector.issuesIdentified,
    eficiência: inspector.efficiency,
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
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="inspeções" fill="#3b82f6" name="Inspeções" />
          <Bar yAxisId="left" dataKey="problemas" fill="#f97316" name="Problemas" />
          <Bar yAxisId="right" dataKey="eficiência" fill="#10b981" name="Eficiência (%)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
