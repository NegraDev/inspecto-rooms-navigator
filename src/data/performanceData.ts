
import { PerformanceReport, TeamPerformance } from "@/types";

// Dados diários de desempenho
export const dailyPerformance: PerformanceReport[] = [
  {
    inspector: "Maria Inspetora",
    inspectionsCompleted: 12,
    averageTime: 15,
    issuesIdentified: 3,
    period: "daily",
    date: "2023-10-15",
    inspectorId: "3",
    inspectorName: "Maria Inspetora",
    averageTimePerInspection: 15,
    efficiency: 92,
  },
  {
    inspector: "João Silva",
    inspectionsCompleted: 10,
    averageTime: 18,
    issuesIdentified: 2,
    period: "daily",
    date: "2023-10-15",
    inspectorId: "5",
    inspectorName: "João Silva",
    averageTimePerInspection: 18,
    efficiency: 85,
  },
  {
    inspector: "Ana Oliveira",
    inspectionsCompleted: 14,
    averageTime: 12,
    issuesIdentified: 5,
    period: "daily",
    date: "2023-10-15",
    inspectorId: "6",
    inspectorName: "Ana Oliveira",
    averageTimePerInspection: 12,
    efficiency: 95,
  },
  {
    inspector: "Maria Inspetora",
    inspectionsCompleted: 11,
    averageTime: 16,
    issuesIdentified: 4,
    period: "daily",
    date: "2023-10-14",
    inspectorId: "3",
    inspectorName: "Maria Inspetora",
    averageTimePerInspection: 16,
    efficiency: 88,
  },
  {
    inspector: "Maria Inspetora",
    inspectionsCompleted: 13,
    averageTime: 14,
    issuesIdentified: 2,
    period: "daily",
    date: "2023-10-13",
    inspectorId: "3",
    inspectorName: "Maria Inspetora",
    averageTimePerInspection: 14,
    efficiency: 93,
  }
];

// Dados semanais de desempenho
export const weeklyPerformance: PerformanceReport[] = [
  {
    inspector: "Maria Inspetora",
    inspectionsCompleted: 58,
    averageTime: 15.5,
    issuesIdentified: 12,
    period: "weekly",
    date: "2023-10-15", // Representa a semana terminando em 15/10
    inspectorId: "3",
    inspectorName: "Maria Inspetora",
    averageTimePerInspection: 15.5,
    efficiency: 91,
  },
  {
    inspector: "João Silva",
    inspectionsCompleted: 52,
    averageTime: 17,
    issuesIdentified: 8,
    period: "weekly",
    date: "2023-10-15",
    inspectorId: "5",
    inspectorName: "João Silva",
    averageTimePerInspection: 17,
    efficiency: 87,
  },
  {
    inspector: "Ana Oliveira",
    inspectionsCompleted: 63,
    averageTime: 13,
    issuesIdentified: 15,
    period: "weekly",
    date: "2023-10-15",
    inspectorId: "6",
    inspectorName: "Ana Oliveira",
    averageTimePerInspection: 13,
    efficiency: 94,
  },
  {
    inspector: "Maria Inspetora",
    inspectionsCompleted: 55,
    averageTime: 16,
    issuesIdentified: 10,
    period: "weekly",
    date: "2023-10-08", // Semana anterior
    inspectorId: "3",
    inspectorName: "Maria Inspetora",
    averageTimePerInspection: 16,
    efficiency: 89,
  }
];

// Dados mensais de desempenho
export const monthlyPerformance: PerformanceReport[] = [
  {
    inspector: "Maria Inspetora",
    inspectionsCompleted: 230,
    averageTime: 15.2,
    issuesIdentified: 45,
    period: "monthly",
    date: "2023-10-01", // Representa outubro de 2023
    inspectorId: "3",
    inspectorName: "Maria Inspetora",
    averageTimePerInspection: 15.2,
    efficiency: 90,
  },
  {
    inspector: "João Silva",
    inspectionsCompleted: 210,
    averageTime: 17.5,
    issuesIdentified: 32,
    period: "monthly",
    date: "2023-10-01",
    inspectorId: "5",
    inspectorName: "João Silva",
    averageTimePerInspection: 17.5,
    efficiency: 86,
  },
  {
    inspector: "Ana Oliveira",
    inspectionsCompleted: 245,
    averageTime: 13.5,
    issuesIdentified: 50,
    period: "monthly",
    date: "2023-10-01",
    inspectorId: "6",
    inspectorName: "Ana Oliveira",
    averageTimePerInspection: 13.5,
    efficiency: 93,
  },
  {
    inspector: "Maria Inspetora",
    inspectionsCompleted: 220,
    averageTime: 16,
    issuesIdentified: 40,
    period: "monthly",
    date: "2023-09-01", // Mês anterior
    inspectorId: "3",
    inspectorName: "Maria Inspetora",
    averageTimePerInspection: 16,
    efficiency: 88,
  }
];

// Função para obter o desempenho da equipe por período
export const getTeamPerformance = (
  period: "daily" | "weekly" | "monthly",
  date?: string
): TeamPerformance => {
  let performanceData: PerformanceReport[];
  
  switch (period) {
    case "daily":
      performanceData = dailyPerformance.filter(p => p.period === "daily");
      break;
    case "weekly":
      performanceData = weeklyPerformance.filter(p => p.period === "weekly");
      break;
    case "monthly":
      performanceData = monthlyPerformance.filter(p => p.period === "monthly");
      break;
    default:
      performanceData = dailyPerformance;
  }
  
  // Filtrar por data se fornecida
  if (date) {
    performanceData = performanceData.filter(p => p.date === date);
  } else {
    // Obter a data mais recente
    const dates = [...new Set(performanceData.map(p => p.date))];
    const latestDate = dates.sort().reverse()[0];
    performanceData = performanceData.filter(p => p.date === latestDate);
  }
  
  // Calcular totais
  const totalInspections = performanceData.reduce(
    (sum, item) => sum + item.inspectionsCompleted,
    0
  );
  
  const totalIssues = performanceData.reduce(
    (sum, item) => sum + item.issuesIdentified,
    0
  );
  
  const averageEfficiency = performanceData.length > 0
    ? Math.round(performanceData.reduce((sum, item) => sum + item.efficiency, 0) / performanceData.length)
    : 0;
  
  return {
    team: "Equipe de Inspeção",
    inspectionsCompleted: totalInspections,
    averageCompletionTime: performanceData.length > 0 
      ? Math.round(performanceData.reduce((sum, item) => sum + item.averageTimePerInspection, 0) / performanceData.length)
      : 0,
    issuesIdentified: totalIssues,
    period,
    totalInspections,
    totalIssues,
    averageEfficiency,
    inspectors: performanceData
  };
};

// Função para obter o desempenho de um inspetor por período
export const getInspectorPerformance = (
  inspectorId: string,
  period: "daily" | "weekly" | "monthly"
): PerformanceReport[] => {
  let performanceData: PerformanceReport[];
  
  switch (period) {
    case "daily":
      performanceData = dailyPerformance.filter(
        p => p.inspectorId === inspectorId && p.period === "daily"
      );
      break;
    case "weekly":
      performanceData = weeklyPerformance.filter(
        p => p.inspectorId === inspectorId && p.period === "weekly"
      );
      break;
    case "monthly":
      performanceData = monthlyPerformance.filter(
        p => p.inspectorId === inspectorId && p.period === "monthly"
      );
      break;
    default:
      performanceData = dailyPerformance.filter(p => p.inspectorId === inspectorId);
  }
  
  return performanceData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
