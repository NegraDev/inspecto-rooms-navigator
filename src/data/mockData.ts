
import { Tower, Room, Equipment, EquipmentType, EquipmentStatus, RoomStatus, Wing, Inspection, InspectionStatus, Inspector, Report } from "../types";

// Towers
export const towers: Tower[] = [
  {
    id: "t1",
    name: "Torre A",
    floors: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    wings: [
      { id: "w1", name: "Ala Norte", towerId: "t1", floorNumber: 1 },
      { id: "w2", name: "Ala Sul", towerId: "t1", floorNumber: 1 }
    ]
  },
  {
    id: "t2",
    name: "Torre B",
    floors: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    wings: [
      { id: "w3", name: "Ala Norte", towerId: "t2", floorNumber: 1 },
      { id: "w4", name: "Ala Sul", towerId: "t2", floorNumber: 1 }
    ]
  }
];

// Equipment generator
const generateEquipment = (roomId: string): Equipment[] => {
  const equipmentTypes = Object.values(EquipmentType);
  const equipmentStatuses = [EquipmentStatus.WORKING, EquipmentStatus.WORKING, EquipmentStatus.WORKING, EquipmentStatus.DAMAGED, EquipmentStatus.MAINTENANCE];
  
  return equipmentTypes.map((type, index) => ({
    id: `eq-${roomId}-${index}`,
    type,
    name: `${type} ${index + 1}`,
    status: equipmentStatuses[Math.floor(Math.random() * equipmentStatuses.length)],
    lastChecked: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
  }));
};

// Rooms generator
export const generateRooms = (): Room[] => {
  const rooms: Room[] = [];
  const roomStatuses = Object.values(RoomStatus);
  
  towers.forEach(tower => {
    for (let floor = 1; floor <= tower.floors.length; floor++) {
      tower.wings.forEach(wing => {
        const roomCount = Math.floor(Math.random() * 4) + 2; // 2-5 rooms per wing per floor
        
        for (let i = 1; i <= roomCount; i++) {
          const roomNumber = `${floor}${wing.id.includes('Norte') ? 'N' : 'S'}${i.toString().padStart(2, '0')}`;
          
          rooms.push({
            id: `room-${tower.id}-${floor}-${wing.id}-${i}`,
            name: `Sala ${roomNumber}`,
            number: roomNumber,
            towerId: tower.id,
            floorNumber: floor,
            wingId: wing.id,
            capacity: Math.floor(Math.random() * 20) + 5,
            equipment: generateEquipment(`${tower.id}-${floor}-${wing.id}-${i}`),
            status: roomStatuses[Math.floor(Math.random() * roomStatuses.length)],
            lastInspection: Math.random() > 0.3 
              ? new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
              : undefined
          });
        }
      });
    }
  });
  
  return rooms;
};

export const rooms = generateRooms();

// Inspectors
export const inspectors: Inspector[] = [
  { 
    id: "i1", 
    name: "Ana Silva", 
    email: "ana.silva@example.com", 
    inspectionsCompleted: 45,
    petrobrasKey: "ANA123",
    role: UserRole.INSPECTOR,
    inspectionsPending: 5
  },
  { 
    id: "i2", 
    name: "Carlos Oliveira", 
    email: "carlos.oliveira@example.com", 
    inspectionsCompleted: 32,
    petrobrasKey: "CARLOS456",
    role: UserRole.INSPECTOR,
    inspectionsPending: 3
  },
  { 
    id: "i3", 
    name: "Mariana Santos", 
    email: "mariana.santos@example.com", 
    inspectionsCompleted: 58,
    petrobrasKey: "MARIANA789",
    role: UserRole.INSPECTOR,
    inspectionsPending: 8
  }
];

// Inspections
export const inspections: Inspection[] = [
  {
    id: "insp1",
    roomId: rooms[0].id,
    roomName: rooms[0].name,
    inspectorId: "i1",
    inspectorName: "Ana Silva",
    status: InspectionStatus.COMPLETED,
    startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 3600000).toISOString(),
    notes: "Tudo em ordem. AC funciona perfeitamente.",
    photos: [
      { 
        id: "p1", 
        url: "/placeholder.svg", 
        caption: "Visão geral da sala", 
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        type: "environment"
      }
    ],
    equipmentChecked: []
  },
  {
    id: "insp2",
    roomId: rooms[1].id,
    roomName: rooms[1].name,
    inspectorId: "i2",
    inspectorName: "Carlos Oliveira",
    status: InspectionStatus.ISSUES_FOUND,
    startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 3600000).toISOString(),
    notes: "TV com problemas de imagem. HDMI funcional.",
    photos: [
      { 
        id: "p2", 
        url: "/placeholder.svg", 
        caption: "TV com problemas", 
        equipmentId: rooms[1].equipment.find(e => e.type === EquipmentType.TV)?.id,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        type: "defect"
      }
    ],
    equipmentChecked: []
  }
];

// Reports
export const reports: Report[] = [
  {
    id: "r1",
    title: "Relatório Mensal - Julho 2023",
    description: "Resumo das inspeções do mês de julho",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: "i1",
    type: "summary",
    data: {
      roomsInspected: 35,
      issuesFound: 8,
      inspectorId: "i1"
    }
  },
  {
    id: "r2",
    title: "Relatório Semanal - Semana 28",
    description: "Resumo das inspeções da semana 28",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: "i2",
    type: "summary",
    data: {
      roomsInspected: 12,
      issuesFound: 3,
      inspectorId: "i2"
    }
  }
];
