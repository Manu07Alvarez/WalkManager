use axum::{http::StatusCode, Json};
use serde::{Serialize};

// TODO: Add OpenAPI path annotations for /notifications and /notifications/preferences
// REVIEW: Support unread filter parameter on notifications query

#[derive(Debug, Serialize)]
pub struct NotificationItemResponse {
    pub id: String,
    pub title: String,
    pub body: String,
    pub read: bool,
}

pub async fn list_notifications_handler() -> (StatusCode, Json<Vec<NotificationItemResponse>>) {
    (
        StatusCode::OK,
        Json(vec![NotificationItemResponse {
            id: "00000000-0000-0000-0000-000000000001".to_string(),
            title: "Booking Updated".to_string(),
            body: "Your walk request was accepted.".to_string(),
            read: false,
        }]),
    )
}
