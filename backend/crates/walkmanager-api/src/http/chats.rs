use axum::{http::StatusCode, Json};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// TODO: Add OpenAPI path annotations for /chats/inquiry and /chats/messages
// REVIEW: Validate caller authentication token before accepting chat messages

#[derive(Debug, Deserialize)]
pub struct CreateInquiryRequest {
    pub walker_id: Uuid,
    pub initial_message: String,
}

#[derive(Debug, Serialize)]
pub struct ChatConversationResponse {
    pub conversation_id: Uuid,
    pub status: String,
}

pub async fn create_inquiry_handler(
    Json(_payload): Json<CreateInquiryRequest>,
) -> (StatusCode, Json<ChatConversationResponse>) {
    (
        StatusCode::CREATED,
        Json(ChatConversationResponse {
            conversation_id: Uuid::new_v4(),
            status: "Active".to_string(),
        }),
    )
}
