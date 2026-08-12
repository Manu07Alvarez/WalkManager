use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

// TODO: Create index on (user_id, expires_at) for fast active restriction lookup
// REVIEW: Store transparent restriction reasons in account_restrictions table

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "account_restrictions")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: Uuid,
    pub user_id: Uuid,
    pub restriction_type: String,
    pub reason: String,
    pub expires_at: DateTimeUtc,
    pub created_at: DateTimeUtc,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
