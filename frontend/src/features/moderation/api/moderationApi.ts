import { z } from 'zod';
import { apiClient } from '../../../shared/api';

export const ApplyRestrictionSchema = z.object({
  userId: z.string(),
  restrictionType: z.enum(['BookingLimited', 'MessagingLimited', 'VisibilityReduced', 'Suspended']),
  reason: z.string().min(5, 'La razón debe tener al menos 5 caracteres'),
});

export type ApplyRestrictionPayload = z.infer<typeof ApplyRestrictionSchema>;

export async function fetchIncidents() {
  const response = await apiClient.get('/v1/moderation/incidents');
  return response.data;
}

export async function applyRestriction(payload: ApplyRestrictionPayload) {
  const response = await apiClient.post('/v1/moderation/restrictions', payload);
  return response.data;
}
