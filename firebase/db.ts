import { db } from "@/firebaseconfig";
import {
    Delivery,
    DeviceCommands,
    LogEntry,
    SlotStatus,
    Telemetry,
} from "@/types";
import { get, off, onValue, push, ref, set, update } from "firebase/database";

// ---------------------------------------------------------------------------
// Root path
// ---------------------------------------------------------------------------
const ROOT = "lockerlink";

// ---------------------------------------------------------------------------
// Ref helpers
// ---------------------------------------------------------------------------
const deliveriesRef = () => ref(db, `${ROOT}/deliveries`);
const otpIndexRef = () => ref(db, `${ROOT}/otpIndex`);
const logsRef = () => ref(db, `${ROOT}/logs`);
const telemetryRef = () => ref(db, `${ROOT}/device/telemetry`);
const slotsRef = () => ref(db, `${ROOT}/device/slots`);

// ---------------------------------------------------------------------------
// Real-time subscriptions  (each returns an unsubscribe function)
// ---------------------------------------------------------------------------

/** Subscribe to all deliveries, sorted newest-first. */
export function subscribeToDeliveries(
  callback: (deliveries: Delivery[]) => void,
): () => void {
  const r = deliveriesRef();
  onValue(r, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      callback([]);
      return;
    }
    const list: Delivery[] = Object.entries(data).map(([id, val]) => ({
      ...(val as Omit<Delivery, "id">),
      id,
    }));
    list.sort((a, b) => b.createdAt - a.createdAt);
    callback(list);
  });
  return () => off(r);
}

/** Subscribe to device telemetry (battery, temperature, lastSeen). */
export function subscribeToTelemetry(
  callback: (telemetry: Telemetry) => void,
): () => void {
  const r = telemetryRef();
  onValue(r, (snapshot) => {
    const data = snapshot.val();
    if (data) callback(data as Telemetry);
  });
  return () => off(r);
}

/** Subscribe to slot statuses. */
export function subscribeToSlots(
  callback: (slots: Record<string, SlotStatus>) => void,
): () => void {
  const r = slotsRef();
  onValue(r, (snapshot) => {
    const data = snapshot.val();
    if (data) callback(data as Record<string, SlotStatus>);
  });
  return () => off(r);
}

/** Subscribe to event log, sorted newest-first (max 50 entries). */
export function subscribeToLogs(
  callback: (logs: LogEntry[]) => void,
): () => void {
  const r = logsRef();
  onValue(r, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      callback([]);
      return;
    }
    const list: LogEntry[] = Object.entries(data).map(([id, val]) => ({
      ...(val as Omit<LogEntry, "id">),
      id,
    }));
    list.sort((a, b) => b.timestamp - a.timestamp);
    callback(list.slice(0, 50));
  });
  return () => off(r);
}

// ---------------------------------------------------------------------------
// Write: add a new delivery
// ---------------------------------------------------------------------------

/**
 * Finds a free slot, generates a collision-safe 4-digit OTP, then writes
 * the delivery and otpIndex atomically via a multi-path update.
 *
 * Returns { success: true } or { success: false, error: string }.
 */
export async function addDelivery(input: {
  title: string;
  description: string;
  coolingNeeded: boolean;
}): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Read current slot state (seed default values if the node is empty)
    const slotsSnap = await get(slotsRef());
    const slotsData: Record<string, SlotStatus> = slotsSnap.val() ?? {
      slot_1: { occupied: false, doorStatus: "locked" },
      slot_2: { occupied: false, doorStatus: "locked" },
    };

    // 2. Find the first free slot
    const freeSlotEntry = Object.entries(slotsData).find(
      ([, s]) => !s.occupied,
    );
    if (!freeSlotEntry) {
      return { success: false, error: "No free slots available." };
    }
    const freeSlot = freeSlotEntry[0];

    // 3. Generate a collision-safe 4-digit OTP
    const otpSnap = await get(otpIndexRef());
    const existingOtps = new Set<string>(
      otpSnap.exists() ? Object.keys(otpSnap.val()) : [],
    );

    let otp = "";
    let attempts = 0;
    do {
      otp = Math.floor(1000 + Math.random() * 9000).toString();
      attempts++;
    } while (existingOtps.has(otp) && attempts < 20);

    if (existingOtps.has(otp)) {
      return {
        success: false,
        error: "Could not generate a unique OTP. Please try again.",
      };
    }

    // 4. Build the delivery record
    const newDeliveryRef = push(deliveriesRef());
    const deliveryId = newDeliveryRef.key!;
    const now = Date.now();

    const delivery: Omit<Delivery, "id"> = {
      title: input.title,
      description: input.description,
      status: "pending",
      otp,
      slotId: freeSlot,
      coolingNeeded: input.coolingNeeded,
      createdAt: now,
      deliveredAt: null,
      pickedUpAt: null,
    };

    // 5. Atomic multi-path write: delivery record + OTP index
    const updates: Record<string, unknown> = {
      [`${ROOT}/deliveries/${deliveryId}`]: delivery,
      [`${ROOT}/otpIndex/${otp}`]: deliveryId,
      // Initialise the slot nodes to locked/unoccupied if they were just seeded
      [`${ROOT}/device/slots/${freeSlot}`]: slotsData[freeSlot],
    };

    // If cooling is needed, turn on the device cooling command
    if (input.coolingNeeded) {
      updates[`${ROOT}/device/commands/cooling`] = true;
    }

    await update(ref(db), updates);
    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: msg };
  }
}

// ---------------------------------------------------------------------------
// Write: send a command to the ESP
// ---------------------------------------------------------------------------

/**
 * Sets a command flag in device/commands.
 * The ESP listens for true, executes the action, then resets the flag to false.
 */
export async function sendCommand(
  key: keyof DeviceCommands,
  value: boolean = true,
): Promise<void> {
  await set(ref(db, `${ROOT}/device/commands/${key}`), value);
}
