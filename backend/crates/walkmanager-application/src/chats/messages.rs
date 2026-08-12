use crate::chats::contracts::SendMessageCommand;

// TODO: Dispatch real-time WebSocket broadcast event to conversation channel
// FIXME: Enforce active account restriction check before sending message

pub struct SendMessageUseCase;

impl SendMessageUseCase {
    pub async fn execute(&self, command: SendMessageCommand) -> Result<uuid::Uuid, String> {
        if command.body.trim().is_empty() {
            return Err("Message body cannot be empty".to_string());
        }
        Ok(uuid::Uuid::new_v4())
    }
}
