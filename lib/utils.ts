export function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
}

export function isOpenNow(workHours?: string | null): boolean {
  if (!workHours) return true;
  const now = new Date();
  const hour = now.getHours();
  const match = workHours.match(/(\d+)(?::(\d+))?\s*(AM|PM|am|pm)\s*[–\-]\s*(\d+)(?::(\d+))?\s*(AM|PM|am|pm)/i);
  if (!match) return true;
  let startH = parseInt(match[1]);
  const startM = parseInt(match[2] || "0");
  if (match[3].toUpperCase() === "PM" && startH !== 12) startH += 12;
  if (match[3].toUpperCase() === "AM" && startH === 12) startH = 0;
  let endH = parseInt(match[4]);
  if (match[6].toUpperCase() === "PM" && endH !== 12) endH += 12;
  if (match[6].toUpperCase() === "AM" && endH === 12) endH = 0;
  const nowMins = hour * 60 + now.getMinutes();
  const startMins = startH * 60 + startM;
  const endMins = endH * 60 + (parseInt(match[5] || "0"));
  return nowMins >= startMins && nowMins < endMins;
}

export function clsx(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
