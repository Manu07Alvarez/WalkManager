use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// TODO: Support recurring walk booking patterns in future releases
// REVIEW: Validate max dog count limit against walker maximum capacity bounds

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum BookingStatus {
    Pending,
    Accepted,
    Rejected,
    Cancelled,
    Expired,
    Completed,
    Disputed,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WalkTimeRange {
    pub start_time: DateTime<Utc>,
    pub end_time: DateTime<Utc>,
}

impl WalkTimeRange {
    pub fn new(start_time: DateTime<Utc>, end_time: DateTime<Utc>) -> Result<Self, String> {
        if start_time >= end_time {
            return Err("Walk start time must be before end time".to_string());
        }
        Ok(Self { start_time, end_time })
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Booking {
    pub id: Uuid,
    pub customer_id: Uuid,
    pub walker_id: Uuid,
    pub time_range: WalkTimeRange,
    pub dog_count: u32,
    pub status: BookingStatus,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl Booking {
    pub fn new(
        customer_id: Uuid,
        walker_id: Uuid,
        time_range: WalkTimeRange,
        dog_count: u32,
    ) -> Result<Self, String> {
        if dog_count == 0 || dog_count > 6 {
            return Err("Dog count per walk must be between 1 and 6".to_string());
        }

        let now = Utc::now();
        Ok(Self {
            id: Uuid::new_v4(),
            customer_id,
            walker_id,
            time_range,
            dog_count,
            status: BookingStatus::Pending,
            created_at: now,
            updated_at: now,
        })
    }
}