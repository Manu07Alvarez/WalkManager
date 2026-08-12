use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// TODO: Support attachment media files in ChatMessage aggregate
// REVIEW: Validate max message length (2000 characters)

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChatMessage {
    pub id: Uuid,
    pub conversation_id: Uuid,
    pub sender_id: Uuid,
    pub content: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PublicInquiryChat {
    pub id: Uuid,
    pub customer_id: Uuid,
    pub walker_id: Uuid,
    pub created_at: DateTime<Utc>,
}