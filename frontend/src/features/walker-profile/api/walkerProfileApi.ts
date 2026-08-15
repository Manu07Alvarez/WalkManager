import { z } from 'zod';
import { apiClient } from '../../../shared/api';

export const walkerProfileSchema = z.object({
  description: z.string().max(1000, 'Descripción máx 1000 caracteres'),
  dogTypes: z.string().optional(),
  maxDogs: z.number().min(1, 'Capacidad mínima 1'),
  pricePerService: z.number().min(0, 'El precio debe ser positivo'),
  zone: z.string().optional(),
  availableDays: z.array(z.string()).optional(),
});

export type WalkerProfileInput = z.infer<typeof walkerProfileSchema>;

export async function fetchMyWalkerProfile() {
  const response = await apiClient.get('/v1/walkers/me/profile');
  return response.data;
}

export async function updateMyWalkerProfile(payload: Partial<WalkerProfileInput & { name?: string }>) {
  const response = await apiClient.put('/v1/walkers/me/profile', payload);
  return response.data;
}
