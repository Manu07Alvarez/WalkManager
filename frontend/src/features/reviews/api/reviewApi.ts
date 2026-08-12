import { z } from 'zod';

// TODO: Define review submission form payload schema validation
// REVIEW: Ensure review comment contains at least 10 non-whitespace characters

export const SubmitReviewSchema = z.object({
  bookingId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'Review comment must be at least 10 characters'),
});

export type SubmitReviewPayload = z.infer<typeof SubmitReviewSchema>;

export async function submitReview(payload: SubmitReviewPayload) {
  const res = await fetch('/api/v1/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to submit review');
  return res.json();
}
