use axum::{extract::Path, http::StatusCode, Json};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// TODO: Add OpenAPI utoipa path annotations for /bookings lifecycle routes
// FIXME: Enforce RBAC middleware check to verify Customer/Walker role on booking state changes

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

#[derive(Debug, Serialize)]
pub struct BookingActionResponse {
    pub booking_id: Uuid,
    pub status: String,
}

pub async fn create_booking_handler(
    Json(_payload): Json<CreateBookingRequest>,
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

pub async fn accept_booking_handler(
    Path(booking_id): Path<Uuid>,
) -> Json<BookingActionResponse> {
    Json(BookingActionResponse {
        booking_id,
        status: "Accepted".to_string(),
    })
}

pub async fn reject_booking_handler(
    Path(booking_id): Path<Uuid>,
) -> Json<BookingActionResponse> {
    Json(BookingActionResponse {
        booking_id,
        status: "Rejected".to_string(),
    })
}

pub async fn cancel_booking_handler(
    Path(booking_id): Path<Uuid>,
) -> Json<BookingActionResponse> {
    Json(BookingActionResponse {
        booking_id,
        status: "Cancelled".to_string(),
    })
}