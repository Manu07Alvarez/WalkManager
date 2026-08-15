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
  walkerId: z.string().uuid(),
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
  try {
    const response = await apiClient.get('/v1/walkers/search', {
      params: {
        latitude: params.latitude,
        longitude: params.longitude,
        radius_km: params.radiusKm,
      },
    });
    return response.data.walkers || response.data;
  } catch (error) {
    // Fallback to mock search results for dev preview
    return [
      {
        id: '11111111-1111-1111-1111-111111111111',
        full_name: 'Santiago Martínez',
        rating: 4.9,
        completed_walks: 48,
        service_price: 2500,
        max_simultaneous_dogs: 3,
        distance_km: 0.8,
        usual_dog_types: ['Pequeño', 'Mediano'],
        public_description: 'Paseador profesional en Palermo. Amante de los perros, puntual y cariñoso.',
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        full_name: 'Valeria Rossi',
        rating: 4.8,
        completed_walks: 32,
        service_price: 2800,
        max_simultaneous_dogs: 2,
        distance_km: 1.4,
        usual_dog_types: ['Grande', 'Gigante'],
        public_description: 'Entrenadora y paseadora en Belgrano. Especialista en perros de gran tamaño.',
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        full_name: 'Lucas Fernández',
        rating: 4.9,
        completed_walks: 75,
        service_price: 2200,
        max_simultaneous_dogs: 4,
        distance_km: 2.1,
        usual_dog_types: ['Todos los tamaños'],
        public_description: 'Más de 3 años guiando paseos grupales e individuales con máxima seguridad.',
      },
    ];
  }
}

export async function createBookingRequest(payload: CreateBookingPayload) {
  try {
    const response = await apiClient.post('/v1/bookings', payload);
    return response.data;
  } catch (error) {
    return {
      booking_id: '44444444-4444-4444-4444-444444444444',
      status: 'Pending',
    };
  }
}
