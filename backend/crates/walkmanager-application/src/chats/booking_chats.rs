use uuid::Uuid;

// TODO: Automatically create booking chat conversation upon Pending booking creation
// REVIEW: Validate historical read access rules for past completed walks

pub struct BookingChatUseCase;

impl BookingChatUseCase {
    pub async fn ensure_booking_chat(&self, _booking_id: Uuid) -> Result<Uuid, String> {
        Ok(Uuid::new_v4())
    }
}
