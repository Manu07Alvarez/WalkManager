use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// TODO: Include dog breed and medical note details in CreateBookingCommand
// REVIEW: Validate ISO-8601 start and end time parsing in application layer

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct CreateBookingCommand {
    pub customer_id: Uuid,
    pub walker_id: Uuid,
    pub start_time: DateTime<Utc>,
    pub end_time: DateTime<Utc>,
    pub dog_count: u32,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct AcceptBookingCommand {
    pub booking_id: Uuid,
    pub walker_id: Uuid,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct RejectBookingCommand {
    pub booking_id: Uuid,
    pub walker_id: Uuid,
    pub reason: Option<String>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct CancelBookingCommand {
    pub booking_id: Uuid,
    pub user_id: Uuid,
    pub reason: Option<String>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct ReportServiceResultCommand {
    pub booking_id: Uuid,
    pub walker_id: Uuid,
    pub result: String,
    pub notes: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BookingResponse {
    pub booking_id: Uuid,
    pub customer_id: Uuid,
    pub walker_id: Uuid,
    pub start_time: DateTime<Utc>,
    pub end_time: DateTime<Utc>,
    pub dog_count: u32,
    pub status: String,
    pub service_result: Option<String>,
    pub created_at: DateTime<Utc>,
}
