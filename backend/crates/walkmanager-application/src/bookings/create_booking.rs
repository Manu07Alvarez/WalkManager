use crate::bookings::contracts::{CreateBookingCommand, BookingResponse};
use walkmanager_domain::bookings::{Booking, WalkTimeRange};
use chrono::Utc;

// TODO: Dispatch booking creation event to DragonflyDB realtime notification queue
// FIXME: Enforce strict check preventing customers from booking their own walker profile

pub struct CreateBookingUseCase;

impl CreateBookingUseCase {
    pub async fn execute(
        &self,
        command: CreateBookingCommand,
    ) -> Result<BookingResponse, String> {
        if command.start_time <= Utc::now() {
            return Err("Walk start time cannot be in the past".to_string());
        }

        let time_range = WalkTimeRange::new(command.start_time, command.end_time)?;
        let booking = Booking::new(
            command.customer_id,
            command.walker_id,
            time_range,
            command.dog_count,
        )?;

        Ok(BookingResponse {
            booking_id: booking.id,
            customer_id: booking.customer_id,
            walker_id: booking.walker_id,
            start_time: booking.time_range.start_time,
            end_time: booking.time_range.end_time,
            dog_count: booking.dog_count,
            status: format!("{:?}", booking.status),
            created_at: booking.created_at,
        })
    }
}
