import { z } from 'zod';

// TODO: Integrate TanStack Query search hook for reactive filter updates
// REVIEW: Validate Zod coordinate and radius schema constraints

export const SearchQuerySchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radiusKm: z.number().positive().default(5),
  maxDogSize: z.string().optional(),
});

export type SearchQueryParams = z.infer<typeof SearchQuerySchema>;

export const CreateBookingRequestSchema = z.object({
  walkerId: z.string().uuid(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  dogCount: z.number().int().min(1).max(6),
});

export type CreateBookingPayload = z.infer<typeof CreateBookingRequestSchema>;

export async function searchWalkers(params: SearchQueryParams) {
  const query = new URLSearchParams({
    latitude: params.latitude.toString(),
    longitude: params.longitude.toString(),
    radius_km: params.radiusKm.toString(),
  });
  const res = await fetch(`/api/v1/walkers/search?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to search walkers');
  return res.json();
}

export async function createBookingRequest(payload: CreateBookingPayload) {
  const res = await fetch('/api/v1/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create booking request');
  return res.json();
}
