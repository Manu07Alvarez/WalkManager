use async_trait::async_trait;

#[async_trait]
pub trait NotificationService: Send + Sync {
    async fn notify_user(&self, user_id: &str, r#type: &str, payload: serde_json::Value) -> Result<(), NotificationError>;
    async fn notify_booking_participants(&self, booking_id: &str, r#type: &str, payload: serde_json::Value) -> Result<(), NotificationError>;
}

#[derive(Debug, thiserror::Error)]
pub enum NotificationError {
    #[error("User not found: {0}")]
    UserNotFound(String),
    #[error("Dispatch failed: {0}")]
    Dispatch(String),
    #[error("Booking not found: {0}")]
    BookingNotFound(String),
}