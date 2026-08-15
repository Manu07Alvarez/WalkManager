use axum::{extract::Path, http::StatusCode, Json};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateBookingRequest {
    #[serde(alias = "walker_id")]
    pub walker_id: Option<String>,
    #[serde(alias = "start_time")]
    pub start_time: Option<String>,
    #[serde(alias = "end_time")]
    pub end_time: Option<String>,
    #[serde(alias = "dog_count")]
    pub dog_count: Option<u32>,
}

#[derive(Debug, Serialize)]
pub struct CreateBookingResponse {
    pub booking_id: String,
    pub status: String,
}

#[derive(Debug, Serialize)]
pub struct BookingActionResponse {
    pub booking_id: String,
    pub status: String,
}

pub async fn create_booking_handler(
    Json(_payload): Json<CreateBookingRequest>,
) -> (StatusCode, Json<CreateBookingResponse>) {
    let booking_id = Uuid::new_v4().to_string();
    (
        StatusCode::CREATED,
        Json(CreateBookingResponse {
            booking_id,
            status: "Pending".to_string(),
        }),
    )
}

pub async fn accept_booking_handler(
    Path(booking_id): Path<String>,
) -> Json<BookingActionResponse> {
    Json(BookingActionResponse {
        booking_id,
        status: "Accepted".to_string(),
    })
}

pub async fn reject_booking_handler(
    Path(booking_id): Path<String>,
) -> Json<BookingActionResponse> {
    Json(BookingActionResponse {
        booking_id,
        status: "Rejected".to_string(),
    })
}

pub async fn cancel_booking_handler(
    Path(booking_id): Path<String>,
) -> Json<BookingActionResponse> {
    Json(BookingActionResponse {
        booking_id,
        status: "Cancelled".to_string(),
    })
}