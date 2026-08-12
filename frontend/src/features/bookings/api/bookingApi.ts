import { z } from 'zod';

// TODO: Connect TanStack Query mutation hooks for booking actions
// REVIEW: Validate service result enum payload schemas

export const ReportServiceResultSchema = z.object({
  serviceResult: z.enum(['Successful', 'Failed']),
  notes: z.string().optional(),
});

export type ReportServiceResultPayload = z.infer<typeof ReportServiceResultSchema>;

export async function acceptBooking(bookingId: string) {
  const res = await fetch(`/api/v1/bookings/${bookingId}/accept`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to accept booking');
  return res.json();
}

export async function rejectBooking(bookingId: string) {
  const res = await fetch(`/api/v1/bookings/${bookingId}/reject`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reject booking');
  return res.json();
}

export async function reportServiceResult(bookingId: string, payload: ReportServiceResultPayload) {
  const res = await fetch(`/api/v1/bookings/${bookingId}/service-result`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to report service result');
  return res.json();
}
