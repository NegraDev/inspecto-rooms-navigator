
import { RoomStatus } from '@/types';

export const getRoomStatusColor = (status: RoomStatus) => {
  switch (status) {
    case RoomStatus.AVAILABLE:
      return "bg-green-500";
    case RoomStatus.OCCUPIED:
      return "bg-blue-500";
    case RoomStatus.MAINTENANCE:
      return "bg-orange-500";
    case RoomStatus.INSPECTION_NEEDED:
      return "bg-red-500";
    case RoomStatus.INSPECTED:
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
};
