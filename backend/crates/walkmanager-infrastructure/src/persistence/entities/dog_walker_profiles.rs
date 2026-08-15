use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "dog_walker_profiles")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: Uuid,
    pub user_id: Uuid,
    pub description: Option<String>,
    pub price_per_hour: f64,
    pub max_simultaneous_dogs: i32,
    pub neighborhood: String,
    pub latitude: f64,
    pub longitude: f64,
    pub rating_avg: f64,
    pub review_count: i32,
    pub profile_photo_url: Option<String>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
