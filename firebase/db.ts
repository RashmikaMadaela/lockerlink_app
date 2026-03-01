import { db } from "@/firebaseconfig";
import {
  Delivery,
  DeviceCommands,
  DeviceRecord,
  LogEntry,
  SlotStatus,
  Telemetry,
  UserProfile,
} from "@/types";
import { get, off, onValue, push, ref, set, update } from "firebase/database";

// ---------------------------------------------------------------------------
// Root helpers
// ---------------------------------------------------------------------------
const ROOT = "lockerlink";
const dr = (deviceId: string) => `${ROOT}/devices/${deviceId}`;

const deliveriesRef = (d: string) => ref(db, `${dr(d)}/deliveries`);
const otpIndexRef = (d: string) => ref(db, `${dr(d)}/otpIndex`);
const logsRef = (d: string) => ref(db, `${dr(d)}/logs`);
const telemetryRef = (d: string) => ref(db, `${dr(d)}/telemetry`);
const slotsRef = (d: string) => ref(db, `${dr(d)}/slots`);
const userRef = (uid: string) => ref(db, `${ROOT}/users/${uid}`);

// ---------------------------------------------------------------------------
// Auth helpers — device verification & user profiles
// ---------------------------------------------------------------------------

/** Read the meta fields (pin, claimed, claimedBy) for a device. */
export async function getDevice(
  deviceId: string,
): Promise<DeviceRecord | null> {
  const snap = await get(ref(db, dr(deviceId)));
  if (!snap.exists()) return null;
  const val = snap.val();
  return {
    pin: val.pin ?? null,
    claimed: val.claimed ?? false,
    claimedBy: val.claimedBy ?? null,
  };
}

/** Mark a device as claimed by a UID (called once at registration). */
export async function claimDevice(
  deviceId: string,
  uid: string,
): Promise<void> {
  await update(ref(db, dr(deviceId)), { claimed: true, claimedBy: uid });
}

/** Write a new user profile under lockerlink/users/{uid}. */
export async function createUserProfile(
  uid: string,
  data: Omit<UserProfile, "uid">,
): Promise<void> {
  await set(userRef(uid), { ...data, uid });
}

/** Read a user profile from lockerlink/users/{uid}. */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await get(userRef(uid));
  return snap.exists() ? (snap.val() as UserProfile) : null;
}

// ---------------------------------------------------------------------------
// Real-time subscriptions  (each returns an unsubscribe function)
// ---------------------------------------------------------------------------

/** Subscribe to all deliveries for a device, sorted newest-first. */
export function subscribeToDeliveries(
  deviceId: string,
  callback: (deliveries: Delivery[]) => void,
): () => void {
  const r = deliveriesRef(deviceId);
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
  deviceId: string,
  callback: (telemetry: Telemetry) => void,
): () => void {
  const r = telemetryRef(deviceId);
  onValue(r, (snapshot) => {
    const data = snapshot.val();
    if (data) callback(data as Telemetry);
  });
  return () => off(r);
}

/** Subscribe to slot statuses. */
export function subscribeToSlots(
  deviceId: string,
  callback: (slots: Record<string, SlotStatus>) => void,
): () => void {
  const r = slotsRef(deviceId);
  onValue(r, (snapshot) => {
    const data = snapshot.val();
    if (data) callback(data as Record<string, SlotStatus>);
  });
  return () => off(r);
}

/** Subscribe to event log, sorted newest-first (max 50 entries). */
export function subscribeToLogs(
  deviceId: string,
  callback: (logs: LogEntry[]) => void,
): () => void {
  const r = logsRef(deviceId);
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
 */
export async function addDelivery(
  deviceId: string,
  input: { title: string; description: string; coolingNeeded: boolean },
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Read current slot state
    const slotsSnap = await get(slotsRef(deviceId));
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
    const otpSnap = await get(otpIndexRef(deviceId));
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
    const newDeliveryRef = push(deliveriesRef(deviceId));
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

    // 5. Atomic multi-path write
    const base = dr(deviceId);
    const updates: Record<string, unknown> = {
      [`${base}/deliveries/${deliveryId}`]: delivery,
      [`${base}/otpIndex/${otp}`]: deliveryId,
      [`${base}/slots/${freeSlot}`]: slotsData[freeSlot],
    };
    if (input.coolingNeeded) updates[`${base}/commands/cooling`] = true;

    await update(ref(db), updates);
    return { success: true };
  } catch (e: unknown) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Unknown error",
    };
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
  deviceId: string,
  key: keyof DeviceCommands,
  value: boolean = true,
): Promise<void> {
  await set(ref(db, `${dr(deviceId)}/commands/${key}`), value);
}
