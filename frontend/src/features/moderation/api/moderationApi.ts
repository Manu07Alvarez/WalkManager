import { z } from 'zod';

// TODO: Define restriction application request schema validation
// REVIEW: Support query pagination on Moderator work item dashboard

export const ApplyRestrictionSchema = z.object({
  userId: z.string().uuid(),
  restrictionType: z.enum(['BookingLimited', 'MessagingLimited', 'VisibilityReduced', 'Suspended']),
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
});

export type ApplyRestrictionPayload = z.infer<typeof ApplyRestrictionSchema>;

export async function applyRestriction(payload: ApplyRestrictionPayload) {
  const res = await fetch('/api/v1/moderation/restrictions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to apply restriction');
  return res.json();
}
