use axum::{extract::Path, http::StatusCode, Json};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// TODO: Add OpenAPI annotations for service result report, confirm, and dispute endpoints
// REVIEW: Validate confirmation period window before accepting dispute requests

#[derive(Debug, Deserialize)]
pub struct ReportServiceResultRequest {
    pub service_result: String,
    pub notes: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct ServiceResultResponse {
    pub booking_id: Uuid,
    pub service_result: String,
    pub status: String,
}

pub async fn report_service_result_handler(
    Path(booking_id): Path<Uuid>,
    Json(payload): Json<ReportServiceResultRequest>,
) -> (StatusCode, Json<ServiceResultResponse>) {
    (
        StatusCode::OK,
        Json(ServiceResultResponse {
            booking_id,
            service_result: payload.service_result,
            status: "Completed".to_string(),
        }),
    )
}
