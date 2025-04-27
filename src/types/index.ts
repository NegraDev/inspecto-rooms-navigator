export type ServiceTicketData = {
  equipmentId: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  contactName: string;
  contactPhone?: string;
  petrobrasKey: string;
  roomId: string;
  roomName: string;
};

export enum OfferType {
  CHAIRS = 'Cadeiras',
  AIR_CONDITIONING = 'Ar Condicionado',
  LIGHTS = 'Lâmpadas',
  TRASH = 'Lixeira',
  DOOR_HANDLES = 'Maçanetas',
  OTHER = 'Outro'
}

export enum EquipmentType {
  TV = 'TV',
  REMOTE = 'Controle Remoto',
  BATTERIES = 'Pilhas',
  HDMI_CABLE = 'Cabo HDMI',
  MTR = 'MTR',
  SWITCH_CABLE_HUB = 'Switch/Hub de Cabos',
  MTOUCH = 'MTouch',
  OUTLETS = 'Tomadas',
  FILTER = 'Filtro',
  MICROPHONE = 'Microfone',
  SPEAKER = 'Alto-falante'
}

export enum EquipmentStatus {
  WORKING = 'working',
  DAMAGED = 'damaged',
  MAINTENANCE = 'maintenance',
  UNKNOWN = 'unknown'
}

export enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
  INSPECTION_NEEDED = 'inspection_needed',
  INSPECTED = 'inspected'
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  INSPECTOR = 'inspector',
  USER = 'user',
  SUPERVISOR = 'supervisor'
}

export enum UserPermission {
  VIEW_ROOMS = 'view_rooms',
  MANAGE_ROOMS = 'manage_rooms',
  VIEW_INSPECTIONS = 'view_inspections',
  MANAGE_INSPECTIONS = 'manage_inspections',
  VIEW_REPORTS = 'view_reports',
  MANAGE_REPORTS = 'manage_reports',
  VIEW_USERS = 'view_users',
  MANAGE_USERS = 'manage_users',
  SYSTEM_SETTINGS = 'system_settings',
  MANAGE_EQUIPMENT = 'manage_equipment'
}

export enum InspectionStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FLAGGED = 'flagged',
  ISSUES_FOUND = 'issues_found'
}

export interface RolePermissions {
  [UserRole.ADMIN]: UserPermission[];
  [UserRole.MANAGER]: UserPermission[];
  [UserRole.INSPECTOR]: UserPermission[];
  [UserRole.USER]: UserPermission[];
}

export interface Photo {
  id: string;
  url: string;
  caption: string;
  timestamp: string;
  equipmentId?: string; // Opcional - para fotos relacionadas a equipamentos específicos
  type: 'door' | 'environment' | 'equipment' | 'defect';
}

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  status: EquipmentStatus;
  lastChecked?: string;
  notes?: string;
  photos?: Photo[];
  needsPhoto?: boolean; // Flag para indicar se precisa de foto (quando com defeito)
}

export interface Wing {
  id: string;
  name: string;
  towerId: string;
  floorNumber: number;
}

export interface Room {
  id: string;
  name: string;
  number: string;
  towerId: string;
  floorNumber: number;
  wingId: string;
  capacity: number;
  status: RoomStatus;
  equipment: Equipment[];
  lastInspection?: string;
  notes?: string;
  image?: string;
}

export interface Tower {
  id: string;
  name: string;
  floors: number[];
  wings: Wing[];
  location?: string;
}

export interface Inspector {
  id: string;
  name: string;
  email: string;
  petrobrasKey: string;
  role: UserRole;
  department?: string;
  inspectionsCompleted: number;
  inspectionsPending: number;
}

export interface Inspection {
  id: string;
  roomId: string;
  roomName: string;
  inspectorId: string;
  inspectorName: string;
  status: InspectionStatus;
  startedAt: string;
  completedAt?: string;
  photos: Photo[];
  notes?: string;
  equipmentChecked: Equipment[];
}

export interface Report {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  createdBy: string;
  type: 'inspection' | 'summary' | 'performance';
  data: any;
}

export interface PerformanceReport {
  inspector: string;
  inspectionsCompleted: number;
  averageTime: number;
  issuesIdentified: number;
  period: string;
  date: string;
  inspectorId?: string;
  inspectorName?: string;
  averageTimePerInspection?: number;
  efficiency: number;
}

export interface TeamPerformance {
  team: string;
  inspectionsCompleted: number;
  averageCompletionTime: number;
  issuesIdentified: number;
  period: string;
  inspectors?: PerformanceReport[];
  totalInspections?: number;
  totalIssues?: number;
  averageEfficiency?: number;
}

export interface AwsConfig {
  region: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  bucketName?: string;
  useAwsServices?: boolean;
  mode?: 'aws' | 'local';
  apiEndpoint?: string;
  apiKey?: string;
  userPoolId?: string;
  clientId?: string;
}

export interface FilterOptions {
  tower?: string;
  floor?: number;
  wing?: string;
  status?: RoomStatus[];
  equipment?: EquipmentType[];
  search?: string;
}

export const RolePermissions: RolePermissions = {
  [UserRole.ADMIN]: [
    UserPermission.VIEW_ROOMS,
    UserPermission.MANAGE_ROOMS,
    UserPermission.VIEW_INSPECTIONS,
    UserPermission.MANAGE_INSPECTIONS,
    UserPermission.VIEW_REPORTS,
    UserPermission.MANAGE_REPORTS,
    UserPermission.VIEW_USERS,
    UserPermission.MANAGE_USERS,
    UserPermission.SYSTEM_SETTINGS,
    UserPermission.MANAGE_EQUIPMENT
  ],
  [UserRole.MANAGER]: [
    UserPermission.VIEW_ROOMS,
    UserPermission.MANAGE_ROOMS,
    UserPermission.VIEW_INSPECTIONS,
    UserPermission.VIEW_REPORTS,
    UserPermission.VIEW_USERS
  ],
  [UserRole.INSPECTOR]: [
    UserPermission.VIEW_ROOMS,
    UserPermission.VIEW_INSPECTIONS
  ],
  [UserRole.USER]: [
    UserPermission.VIEW_ROOMS
  ]
};
