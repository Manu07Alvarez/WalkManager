use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SubmitReviewCommand {
    pub booking_id: Uuid,
    pub customer_id: Uuid,
    pub rating: u8,
    pub comment: String,
}
