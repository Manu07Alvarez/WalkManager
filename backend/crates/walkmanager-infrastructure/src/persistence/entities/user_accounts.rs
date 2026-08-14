use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "user_accounts")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: Uuid,
    pub role: String,
    pub email: String,
    pub phone_number: String,
    pub full_name: String,
    pub cuil: String,
    pub status: String,
    pub created_at: DateTimeWithTimeZone,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}