use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

// TODO: Create index on (walker_id, moderation_status) for fast public review retrieval
// REVIEW: Store moderation_status as string enum (Pending, Approved, Rejected)

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "reviews")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: Uuid,
    pub booking_id: Uuid,
    pub customer_id: Uuid,
    pub walker_id: Uuid,
    pub rating: i32,
    pub comment: String,
    pub moderation_status: String,
    pub created_at: DateTimeUtc,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
