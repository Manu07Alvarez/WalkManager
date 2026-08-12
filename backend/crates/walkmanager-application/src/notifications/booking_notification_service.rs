use uuid::Uuid;

// TODO: Dispatch DragonflyDB notification event for booking status updates
// REVIEW: Format localized notification text for mobile push dispatch

pub struct BookingNotificationService;

impl BookingNotificationService {
    pub async fn notify_status_change(
        &self,
        _booking_id: Uuid,
        _new_status: &str,
    ) -> Result<(), String> {
        Ok(())
    }
}
