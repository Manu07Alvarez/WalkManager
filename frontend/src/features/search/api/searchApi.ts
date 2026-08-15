import { z } from 'zod';
import { apiClient } from '../../../shared/api';

export const SearchQuerySchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radiusKm: z.number().positive().default(5),
  maxDogSize: z.string().optional(),
});

export type SearchQueryParams = z.infer<typeof SearchQuerySchema>;

export const CreateBookingRequestSchema = z.object({
  walkerId: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  dogCount: z.number().int().min(1).max(6),
});

export type CreateBookingPayload = z.infer<typeof CreateBookingRequestSchema>;

export interface WalkerSearchResult {
  id: string;
  full_name: string;
  rating: number;
  completed_walks: number;
  service_price: number;
  max_simultaneous_dogs: number;
  distance_km: number;
  usual_dog_types: string[];
  public_description: string;
}

export async function searchWalkers(params: SearchQueryParams): Promise<WalkerSearchResult[]> {
  const response = await apiClient.get('/v1/walkers/search', {
    params: {
      latitude: params.latitude,
      longitude: params.longitude,
      radius_km: params.radiusKm,
    },
  });
  return response.data.walkers || response.data;
}

export async function createBookingRequest(payload: CreateBookingPayload) {
  const response = await apiClient.post('/v1/bookings', payload);
  return response.data;
}
