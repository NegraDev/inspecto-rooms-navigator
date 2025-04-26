
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
