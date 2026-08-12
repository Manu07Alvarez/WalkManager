use serde::{Deserialize, Serialize};
use uuid::Uuid;

// TODO: Include review rating summary DTO for public profile header
// REVIEW: Validate comment string encoding UTF-8 cleanliness

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SubmitReviewCommand {
    pub booking_id: Uuid,
    pub customer_id: Uuid,
    pub rating: u8,
    pub comment: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReviewResponse {
    pub id: Uuid,
    pub booking_id: Uuid,
    pub customer_id: Uuid,
    pub walker_id: Uuid,
    pub rating: u8,
    pub comment: String,
    pub moderation_status: String,
    pub created_at: String,
}
