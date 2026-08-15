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

// 🚀 In-Memory Search Cache for Geospatial Proximity Queries
interface CacheEntry {
  timestamp: number;
  data: WalkerSearchResult[];
}

const SEARCH_CACHE = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000; // 60 seconds TTL

export function getSearchCacheKey(params: SearchQueryParams): string {
  const lat = params.latitude.toFixed(3);
  const lng = params.longitude.toFixed(3);
  const radius = params.radiusKm.toFixed(1);
  return `geo_search:${lat}:${lng}:${radius}`;
}

export function clearSearchCache(): void {
  SEARCH_CACHE.clear();
}

export async function searchWalkers(params: SearchQueryParams): Promise<WalkerSearchResult[]> {
  const cacheKey = getSearchCacheKey(params);
  const now = Date.now();
  const cached = SEARCH_CACHE.get(cacheKey);

  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const response = await apiClient.get('/v1/walkers/search', {
    params: {
      latitude: params.latitude,
      longitude: params.longitude,
      radius_km: params.radiusKm,
    },
  });

  const result = response.data.walkers || response.data;
  SEARCH_CACHE.set(cacheKey, { timestamp: now, data: result });
  return result;
}

export async function createBookingRequest(payload: CreateBookingPayload) {
  const response = await apiClient.post('/v1/bookings', payload);
  return response.data;
}
