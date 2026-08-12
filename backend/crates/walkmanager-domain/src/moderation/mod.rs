use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// TODO: Define incident severity weights (Low = 1, Medium = 2, High = 3)
// REVIEW: Support transparent account restriction reason messages for affected users

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum IncidentType {
    NoShow,
    Cancellation,
    DisputedResult,
    FailedService,
    RepeatedRejection,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum RestrictionType {
    BookingLimited,
    MessagingLimited,
    VisibilityReduced,
    Suspended,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IncidentRecord {
    pub id: Uuid,
    pub user_id: Uuid,
    pub booking_id: Option<Uuid>,
    pub incident_type: IncidentType,
    pub description: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AccountRestriction {
    pub id: Uuid,
    pub user_id: Uuid,
    pub restriction_type: RestrictionType,
    pub reason: String,
    pub expires_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
}