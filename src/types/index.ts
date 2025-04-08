export enum EquipmentType {
  TV = "TV",
  REMOTE = "Controle",
  BATTERIES = "Pilhas",
  HDMI_CABLE = "Cabo HDMI",
  MTR = "MTR",
  SWITCH_CABLE_HUB = "Switch/Cable Hub",
  MTOUCH = "MTouch",
  OUTLETS = "Tomadas",
  FILTER = "Filtros",
  MICROPHONE = "Microfone",
  SPEAKER = "Caixa de Som"
}

export type Tower = {
  id: string;
  name: string;
  floors: number;
  wings: Wing[];
};

export type Wing = {
  id: string;
  name: string;
  towerId: string;
};

export type Floor = {
  id: string;
  number: number;
  towerId: string;
};

export type Room = {
  id: string;
  name: string;
  number: string;
  towerId: string;
  floorNumber: number;
  wingId: string;
  capacity: number;
  equipment: Equipment[];
  status: RoomStatus;
  lastInspection?: string;
  image?: string;
};

export type Equipment = {
  id: string;
  type: EquipmentType;
  name: string;
  status: EquipmentStatus;
  lastChecked?: string;
};

export enum EquipmentStatus {
  WORKING = "WORKING",
  DAMAGED = "DAMAGED",
  MAINTENANCE = "MAINTENANCE",
  UNKNOWN = "UNKNOWN"
}

export enum RoomStatus {
  AVAILABLE = "AVAILABLE",
  OCCUPIED = "OCCUPIED",
  MAINTENANCE = "MAINTENANCE",
  INSPECTION_NEEDED = "INSPECTION_NEEDED",
  INSPECTED = "INSPECTED"
}

export type Inspection = {
  id: string;
  roomId: string;
  inspectorId: string;
  date: string;
  notes: string;
  photos: Photo[];
  status: InspectionStatus;
};

export type Photo = {
  id: string;
  url: string;
  caption?: string;
  equipmentId?: string;
  timestamp: string;
};

export enum InspectionStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  ISSUES_FOUND = "ISSUES_FOUND"
}

export type Inspector = {
  id: string;
  name: string;
  email: string;
  inspectionsCompleted: number;
};

export type FilterOptions = {
  tower?: string;
  floor?: number;
  wing?: string;
  equipment?: EquipmentType[];
  status?: RoomStatus[];
};

export type Report = {
  id: string;
  title: string;
  date: string;
  roomsInspected: number;
  issuesFound: number;
  inspectorId: string;
  inspectionIds: string[];
};

export type PerformanceReport = {
  id: string;
  period: 'daily' | 'weekly' | 'monthly';
  date: string;
  inspectorId: string;
  inspectorName: string;
  inspectionsCompleted: number;
  issuesIdentified: number;
  averageTimePerInspection: number;
  efficiency: number;
};

export type TeamPerformance = {
  period: 'daily' | 'weekly' | 'monthly';
  date: string;
  inspectors: PerformanceReport[];
  totalInspections: number;
  totalIssues: number;
  averageEfficiency: number;
};

export interface AwsConfig {
  mode: 'aws' | 'local';
  apiEndpoint: string;
  apiKey?: string;
  userPoolId?: string;
  clientId?: string;
  region: string;
}
