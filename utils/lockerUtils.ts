/**
 * Formats a Unix millisecond timestamp into a human-readable relative string.
 * e.g.  "Today 10:27 AM"  |  "Yesterday 06:45 PM"  |  "Feb 20, 03:12 PM"
 */
export function formatTimestamp(ms: number): string {
  const date = new Date(ms);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) return `Today ${timeStr}`;
  if (isYesterday) return `Yesterday ${timeStr}`;

  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return `${dateStr}, ${timeStr}`;
}

/**
 * Returns a slot label suitable for display (e.g. "slot_1" → "Slot 1").
 */
export function formatSlotLabel(slotId: string): string {
  return slotId.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
