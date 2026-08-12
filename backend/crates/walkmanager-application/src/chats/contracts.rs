use serde::{Deserialize, Serialize};
use uuid::Uuid;

// TODO: Define WebSocket event payload envelope for chat message broadcast
// REVIEW: Enforce participant validation on message dispatch command

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SendMessageCommand {
    pub conversation_id: Uuid,
    pub sender_user_id: Uuid,
    pub body: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateInquiryChatCommand {
    pub customer_id: Uuid,
    pub walker_id: Uuid,
    pub initial_message: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WsChatMessageEvent {
    pub event_type: String,
    pub conversation_id: Uuid,
    pub message_id: Uuid,
    pub sender_id: Uuid,
    pub content: String,
    pub timestamp: String,
}
