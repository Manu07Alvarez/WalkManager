use axum::{http::StatusCode, Json};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// TODO: Add OpenAPI annotations for POST /reviews and GET /walkers/{id}/reviews
// REVIEW: Enforce Moderator role authorization check on review approval/rejection routes

#[derive(Debug, Deserialize)]
pub struct SubmitReviewRequest {
    pub booking_id: Uuid,
    pub rating: u8,
    pub comment: String,
}

#[derive(Debug, Serialize)]
pub struct SubmitReviewResponse {
    pub review_id: Uuid,
    pub status: String,
}

pub async fn submit_review_handler(
    Json(payload): Json<SubmitReviewRequest>,
) -> (StatusCode, Json<SubmitReviewResponse>) {
    let _ = payload;
    (
        StatusCode::CREATED,
        Json(SubmitReviewResponse {
            review_id: Uuid::new_v4(),
            status: "Pending".to_string(),
        }),
    )
}
