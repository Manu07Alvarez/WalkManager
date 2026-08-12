use chrono::{DateTime, Utc};
use uuid::Uuid;

// TODO: Cache walker availability windows in DragonflyDB for rapid validation
// FIXME: Ensure concurrent bookings within overlapping windows respect maximum dog capacity

pub struct AvailabilityValidationService;

impl AvailabilityValidationService {
    pub fn is_available(
        _walker_id: Uuid,
        _start_time: DateTime<Utc>,
        _end_time: DateTime<Utc>,
        requested_dogs: u32,
        max_capacity: u32,
        current_accepted_dogs: u32,
    ) -> Result<bool, String> {
        if current_accepted_dogs + requested_dogs > max_capacity {
            return Ok(false);
        }
        Ok(true)
    }
}
