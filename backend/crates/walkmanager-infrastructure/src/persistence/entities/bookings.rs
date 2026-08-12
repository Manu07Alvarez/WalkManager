use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

// TODO: Add composite spatial index on walker service area location
// REVIEW: Ensure status enum maps cleanly to PostgreSQL booking_status enum type

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "bookings")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Uuid,
    pub customer_id: Uuid,
    pub walker_id: Uuid,
    pub start_time: DateTimeUtc,
    pub end_time: DateTimeUtc,
    pub dog_count: i32,
    pub status: String,
    pub created_at: DateTimeUtc,
    pub updated_at: DateTimeUtc,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
