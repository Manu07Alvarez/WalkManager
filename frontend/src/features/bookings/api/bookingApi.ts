import { z } from 'zod';
import { apiClient } from '../../../shared/api';

export const ReportServiceResultSchema = z.object({
  serviceResult: z.enum(['Successful', 'Failed']),
  notes: z.string().optional(),
});

export type ReportServiceResultPayload = z.infer<typeof ReportServiceResultSchema>;

export async function fetchUserBookings() {
  const response = await apiClient.get('/v1/bookings');
  return response.data;
}

export async function acceptBooking(bookingId: string) {
  const response = await apiClient.post(`/v1/bookings/${bookingId}/accept`);
  return response.data;
}

export async function rejectBooking(bookingId: string) {
  const response = await apiClient.post(`/v1/bookings/${bookingId}/reject`);
  return response.data;
}

export async function cancelBooking(bookingId: string) {
  const response = await apiClient.post(`/v1/bookings/${bookingId}/cancel`);
  return response.data;
}

export async function reportServiceResult(bookingId: string, payload: ReportServiceResultPayload) {
  const response = await apiClient.post(`/v1/bookings/${bookingId}/service-result`, payload);
  return response.data;
}
