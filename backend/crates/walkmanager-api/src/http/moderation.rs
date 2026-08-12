use axum::{http::StatusCode, Json};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// TODO: Add OpenAPI utoipa annotations for /moderation/work-items and /moderation/restrictions
// REVIEW: Require Moderator role RBAC permission on all /moderation endpoints

#[derive(Debug, Deserialize)]
pub struct ApplyRestrictionRequest {
    pub user_id: Uuid,
    pub restriction_type: String,
    pub reason: String,
}

#[derive(Debug, Serialize)]
pub struct ApplyRestrictionResponse {
    pub restriction_id: Uuid,
    pub status: String,
}

pub async fn apply_restriction_handler(
    Json(payload): Json<ApplyRestrictionRequest>,
) -> (StatusCode, Json<ApplyRestrictionResponse>) {
    let _ = payload;
    (
        StatusCode::CREATED,
        Json(ApplyRestrictionResponse {
            restriction_id: Uuid::new_v4(),
            status: "Applied".to_string(),
        }),
    )
}
