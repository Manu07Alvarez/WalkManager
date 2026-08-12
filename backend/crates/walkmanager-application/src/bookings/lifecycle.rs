use crate::bookings::contracts::{RejectBookingCommand, CancelBookingCommand};

// TODO: Create incident record if booking cancellation or rejection meets threshold rules
// REVIEW: Validate caller ownership before executing booking cancellation

pub struct RejectBookingUseCase;

impl RejectBookingUseCase {
    pub async fn execute(&self, command: RejectBookingCommand) -> Result<(), String> {
        if command.booking_id == uuid::Uuid::nil() {
            return Err("Invalid booking ID".to_string());
        }
        Ok(())
    }
}

pub struct CancelBookingUseCase;

impl CancelBookingUseCase {
    pub async fn execute(&self, command: CancelBookingCommand) -> Result<(), String> {
        if command.booking_id == uuid::Uuid::nil() {
            return Err("Invalid booking ID".to_string());
        }
        Ok(())
    }
}
