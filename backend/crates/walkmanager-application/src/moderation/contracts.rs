use serde::{Deserialize, Serialize};
use uuid::Uuid;

// TODO: Include incident details in moderation work item list query DTO
// REVIEW: Validate dispute resolution outcome enum values

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RecordIncidentCommand {
    pub user_id: Uuid,
    pub booking_id: Option<Uuid>,
    pub incident_type: String,
    pub description: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ApplyRestrictionCommand {
    pub user_account_id: Uuid,
    pub restriction_type: String,
    pub reason: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResolveDisputeCommand {
    pub booking_id: Uuid,
    pub resolved_result: String,
    pub notes: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModerationWorkItemResponse {
    pub id: Uuid,
    pub booking_id: Uuid,
    pub customer_id: Uuid,
    pub walker_id: Uuid,
    pub issue_type: String,
    pub status: String,
    pub created_at: String,
}
