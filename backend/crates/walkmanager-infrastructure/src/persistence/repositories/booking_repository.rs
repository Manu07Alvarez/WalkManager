use sea_orm::DatabaseConnection;
use uuid::Uuid;

// TODO: Use SeaORM database transaction to recheck availability before marking booking Accepted
// REVIEW: Enforce concurrency locking using SELECT FOR UPDATE on booking record

pub struct BookingRepository {
    pub db: DatabaseConnection,
}

impl BookingRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn update_status(&self, booking_id: Uuid, status: &str) -> Result<(), String> {
        if booking_id == Uuid::nil() {
            return Err("Invalid booking ID".to_string());
        }
        let _ = status;
        Ok(())
    }
}
