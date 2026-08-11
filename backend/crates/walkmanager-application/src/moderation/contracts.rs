use serde::{Deserialize, Serialize};
use uuid::Uuid;

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
