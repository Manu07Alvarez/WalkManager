use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateBookingCommand {
    pub customer_id: Uuid,
    pub walker_id: Uuid,
    pub neighborhood_zone_id: Uuid,
    pub scheduled_start: String,
    pub scheduled_end: String,
    pub timezone: String,
    pub dog_count: u32,
}
