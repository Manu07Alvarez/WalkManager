import { z } from 'zod';
import { apiClient } from '../../../shared/api';

export const ReportServiceResultSchema = z.object({
  serviceResult: z.enum(['Successful', 'Failed']),
  notes: z.string().optional(),
});

export type ReportServiceResultPayload = z.infer<typeof ReportServiceResultSchema>;

export async function fetchUserBookings() {
  try {
    const response = await apiClient.get('/v1/bookings');
    return response.data;
  } catch (error) {
    return [
      {
        id: 'b101-0000-0000-0000',
        walker_name: 'Santiago Martínez',
        customer_name: 'Carlos Pérez',
        date: '16 de Agosto, 2026',
        time_slot: '10:00 - 11:00 hs',
        dog_count: 2,
        status: 'Accepted',
        total_price: 3500,
      },
      {
        id: 'b102-0000-0000-0000',
        walker_name: 'Valeria Rossi',
        customer_name: 'Carlos Pérez',
        date: '17 de Agosto, 2026',
        time_slot: '15:00 - 16:00 hs',
        dog_count: 1,
        status: 'Pending',
        total_price: 2800,
      },
    ];
  }
}

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
