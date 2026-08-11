use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SendMessageCommand {
    pub conversation_id: Uuid,
    pub sender_user_id: Uuid,
    pub body: String,
}
