export type TimeStatus = 'open' | 'closed' | 'cancelled';

export function computeTimeStatus(start: Date, end: Date): TimeStatus {
  const now = new Date();

  if (now >= start && now <= end) return 'open';
  return 'closed';
}
