use crate::chats::contracts::CreateInquiryChatCommand;

// TODO: Enforce DragonflyDB rate limiting key check per customer identity before inquiry creation
// REVIEW: Prohibit inquiry chats if customer has an active booking with walker

pub struct PublicInquiryUseCase;

impl PublicInquiryUseCase {
    pub async fn execute(&self, command: CreateInquiryChatCommand) -> Result<uuid::Uuid, String> {
        if command.initial_message.is_empty() {
            return Err("Initial message cannot be empty".to_string());
        }
        Ok(uuid::Uuid::new_v4())
    }
}
