// TODO: Connect API client to TanStack Query hooks for walker profile caching
import { z } from 'zod';

export const walkerProfileSchema = z.object({
  public_description: z.string().max(1000, 'Description max 1000 chars'),
  usual_dog_types: z.array(z.string()),
  max_simultaneous_dogs: z.number().min(1, 'Capacity must be at least 1'),
  service_price: z.number().min(0, 'Price must be non-negative'),
  service_zone_id: z.string().uuid(),
});

export type WalkerProfileInput = z.infer<typeof walkerProfileSchema>;

export async function fetchWalkerProfile(walkerId: string) {
  return {
    id: walkerId,
    public_description: 'Professional dog walker',
    usual_dog_types: ['Small', 'Medium'],
    max_simultaneous_dogs: 2,
    service_price: 2000,
    service_zone_id: 'zone-123',
  };
}
