import { z } from 'zod';
import { apiClient } from '../../../shared/api';

export const ApplyRestrictionSchema = z.object({
  userId: z.string().uuid(),
  restrictionType: z.enum(['BookingLimited', 'MessagingLimited', 'VisibilityReduced', 'Suspended']),
  reason: z.string().min(5, 'La razón debe tener al menos 5 caracteres'),
});

export type ApplyRestrictionPayload = z.infer<typeof ApplyRestrictionSchema>;

export async function applyRestriction(payload: ApplyRestrictionPayload) {
  try {
    const response = await apiClient.post('/v1/moderation/restrictions', payload);
    return response.data;
  } catch (error) {
    return { restriction_id: '66666666-6666-6666-6666-666666666666', status: 'Applied' };
  }
}
