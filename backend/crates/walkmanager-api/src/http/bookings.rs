use axum::{http::StatusCode, Json};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// TODO: Add OpenAPI utoipa path annotations for /bookings
// FIXME: Enforce RBAC middleware check to verify Customer role on booking creation

#[derive(Debug, Deserialize)]
pub struct CreateBookingRequest {
    pub walker_id: Uuid,
    pub start_time: String,
    pub end_time: String,
    pub dog_count: u32,
}

#[derive(Debug, Serialize)]
pub struct CreateBookingResponse {
    pub booking_id: Uuid,
    pub status: String,
}

pub async fn create_booking_handler(
    Json(payload): Json<CreateBookingRequest>,
) -> (StatusCode, Json<CreateBookingResponse>) {
    let booking_id = Uuid::new_v4();
    (
        StatusCode::CREATED,
        Json(CreateBookingResponse {
            booking_id,
            status: "Pending".to_string(),
        }),
    )
}