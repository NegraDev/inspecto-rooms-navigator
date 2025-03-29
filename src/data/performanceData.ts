
import { PerformanceReport, TeamPerformance } from "@/types";

// Dados diários de desempenho
export const dailyPerformance: PerformanceReport[] = [
  {
    id: "dp1",
    period: "daily",
    date: "2023-10-15",
    inspectorId: "3",
    inspectorName: "Maria Inspetora",
    inspectionsCompleted: 12,
    issuesIdentified: 3,
    averageTimePerInspection: 15,
    efficiency: 92,
  },
  {
    id: "dp2",
    period: "daily",
    date: "2023-10-15",
    inspectorId: "5",
    inspectorName: "João Silva",
    inspectionsCompleted: 10,
    issuesIdentified: 2,
    averageTimePerInspection: 18,
    efficiency: 85,
  },
  {
    id: "dp3",
    period: "daily",
    date: "2023-10-15",
    inspectorId: "6",
    inspectorName: "Ana Oliveira",
    inspectionsCompleted: 14,
    issuesIdentified: 5,
    averageTimePerInspection: 12,
    efficiency: 95,
  },
  {
    id: "dp4",
    period: "daily",
    date: "2023-10-14",
    inspectorId: "3",
    inspectorName: "Maria Inspetora",
    inspectionsCompleted: 11,
    issuesIdentified: 4,
    averageTimePerInspection: 16,
    efficiency: 88,
  },
  {
    id: "dp5",
    period: "daily",
    date: "2023-10-13",
    inspectorId: "3",
    inspectorName: "Maria Inspetora",
    inspectionsCompleted: 13,
    issuesIdentified: 2,
    averageTimePerInspection: 14,
    efficiency: 93,
  }
];

// Dados semanais de desempenho
export const weeklyPerformance: PerformanceReport[] = [
  {
    id: "wp1",
    period: "weekly",
    date: "2023-10-15", // Representa a semana terminando em 15/10
    inspectorId: "3",
    inspectorName: "Maria Inspetora",
    inspectionsCompleted: 58,
    issuesIdentified: 12,
    averageTimePerInspection: 15.5,
    efficiency: 91,
  },
  {
    id: "wp2",
    period: "weekly",
    date: "2023-10-15",
    inspectorId: "5",
    inspectorName: "João Silva",
    inspectionsCompleted: 52,
    issuesIdentified: 8,
    averageTimePerInspection: 17,
    efficiency: 87,
  },
  {
    id: "wp3",
    period: "weekly",
    date: "2023-10-15",
    inspectorId: "6",
    inspectorName: "Ana Oliveira",
    inspectionsCompleted: 63,
    issuesIdentified: 15,
    averageTimePerInspection: 13,
    efficiency: 94,
  },
  {
    id: "wp4",
    period: "weekly",
    date: "2023-10-08", // Semana anterior
    inspectorId: "3",
    inspectorName: "Maria Inspetora",
    inspectionsCompleted: 55,
    issuesIdentified: 10,
    averageTimePerInspection: 16,
    efficiency: 89,
  }
];

// Dados mensais de desempenho
export const monthlyPerformance: PerformanceReport[] = [
  {
    id: "mp1",
    period: "monthly",
    date: "2023-10-01", // Representa outubro de 2023
    inspectorId: "3",
    inspectorName: "Maria Inspetora",
    inspectionsCompleted: 230,
    issuesIdentified: 45,
    averageTimePerInspection: 15.2,
    efficiency: 90,
  },
  {
    id: "mp2",
    period: "monthly",
    date: "2023-10-01",
    inspectorId: "5",
    inspectorName: "João Silva",
    inspectionsCompleted: 210,
    issuesIdentified: 32,
    averageTimePerInspection: 17.5,
    efficiency: 86,
  },
  {
    id: "mp3",
    period: "monthly",
    date: "2023-10-01",
    inspectorId: "6",
    inspectorName: "Ana Oliveira",
    inspectionsCompleted: 245,
    issuesIdentified: 50,
    averageTimePerInspection: 13.5,
    efficiency: 93,
  },
  {
    id: "mp4",
    period: "monthly",
    date: "2023-09-01", // Mês anterior
    inspectorId: "3",
    inspectorName: "Maria Inspetora",
    inspectionsCompleted: 220,
    issuesIdentified: 40,
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
    period,
    date: performanceData.length > 0 ? performanceData[0].date : new Date().toISOString().split('T')[0],
    inspectors: performanceData,
    totalInspections,
    totalIssues,
    averageEfficiency
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
