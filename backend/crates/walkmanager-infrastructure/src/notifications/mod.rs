pub mod dispatcher;
pub mod types;

pub use dispatcher::*;
pub use types::*;

use async_trait::async_trait;

#[async_trait]
pub trait NotificationDispatcher: Send + Sync {
    async fn send(&self, user_id: &str, message: NotificationMessage) -> Result<(), NotificationError>;
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct NotificationMessage {
    pub id: String,
    pub r#type: String,
    pub payload: serde_json::Value,
    pub timestamp: i64,
}

#[derive(Debug, thiserror::Error)]
pub enum NotificationError {
    #[error("User not found: {0}")]
    UserNotFound(String),
    #[error("Dispatch failed: {0}")]
    Dispatch(String),
}