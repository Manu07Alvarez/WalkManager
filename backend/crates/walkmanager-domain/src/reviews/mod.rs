use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// TODO: Validate star rating score between 1 and 5
// REVIEW: Prohibit walker reply fields on Review aggregate

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum ModerationStatus {
    Pending,
    Approved,
    Rejected,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Review {
    pub id: Uuid,
    pub booking_id: Uuid,
    pub customer_id: Uuid,
    pub walker_id: Uuid,
    pub rating: u8,
    pub comment: String,
    pub moderation_status: ModerationStatus,
    pub created_at: DateTime<Utc>,
}

impl Review {
    pub fn new(
        booking_id: Uuid,
        customer_id: Uuid,
        walker_id: Uuid,
        rating: u8,
        comment: String,
    ) -> Result<Self, String> {
        if !(1..=5).contains(&rating) {
            return Err("Rating score must be between 1 and 5".to_string());
        }
        if comment.trim().len() < 10 {
            return Err("Review comment must be at least 10 characters".to_string());
        }

        Ok(Self {
            id: Uuid::new_v4(),
            booking_id,
            customer_id,
            walker_id,
            rating,
            comment,
            moderation_status: ModerationStatus::Pending,
            created_at: Utc::now(),
        })
    }
}