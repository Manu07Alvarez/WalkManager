use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "incidents")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: Uuid,
    pub user_account_id: Uuid,
    pub booking_id: Option<Uuid>,
    pub incident_type: String,
    pub severity: String,
    pub description: String,
    pub created_at: DateTimeWithTimeZone,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
