export type DeliveryStatus = "pending" | "delivered" | "picked-up";

export type Delivery = {
  id: string; // Firebase push key
  title: string;
  description: string;
  status: DeliveryStatus;
  otp: string;
  slotId: string;
  coolingNeeded: boolean;
  createdAt: number; // Unix ms
  deliveredAt: number | null;
  pickedUpAt: number | null;
};

export type LogAction = "opened" | "closed" | "delivery" | "pickup";

export type LogEntry = {
  id: string; // Firebase push key
  action: LogAction;
  slotId: string;
  deliveryId: string | null;
  timestamp: number; // Unix ms
};

export type SlotStatus = {
  occupied: boolean;
  doorStatus: "locked" | "unlocked";
};

export type Telemetry = {
  battery: number; // percent (0-100)
  temperature: number; // °C
  lastSeen: number; // Unix ms
};

export type DeviceCommands = {
  openDoor: boolean;
  reset: boolean;
  cooling: boolean;
};
