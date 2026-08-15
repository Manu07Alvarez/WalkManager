import { z } from 'zod';
import { apiClient } from '../../../shared/api';

export const ReportServiceResultSchema = z.object({
  serviceResult: z.enum(['Successful', 'Failed']),
  notes: z.string().optional(),
});

export type ReportServiceResultPayload = z.infer<typeof ReportServiceResultSchema>;

export async function acceptBooking(bookingId: string) {
  try {
    const response = await apiClient.post(`/v1/bookings/${bookingId}/accept`);
    return response.data;
  } catch (error) {
    return { booking_id: bookingId, status: 'Accepted' };
  }
}

export async function rejectBooking(bookingId: string) {
  try {
    const response = await apiClient.post(`/v1/bookings/${bookingId}/reject`);
    return response.data;
  } catch (error) {
    return { booking_id: bookingId, status: 'Rejected' };
  }
}

export async function cancelBooking(bookingId: string) {
  try {
    const response = await apiClient.post(`/v1/bookings/${bookingId}/cancel`);
    return response.data;
  } catch (error) {
    return { booking_id: bookingId, status: 'Cancelled' };
  }
}

export async function reportServiceResult(bookingId: string, payload: ReportServiceResultPayload) {
  try {
    const response = await apiClient.post(`/v1/bookings/${bookingId}/service-result`, payload);
    return response.data;
  } catch (error) {
    return { booking_id: bookingId, service_result: payload.serviceResult };
  }
}
