use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WalkerProfileUpdate {
    pub public_description: String,
    pub usual_dog_types: Vec<String>,
    pub max_simultaneous_dogs: u32,
    pub service_price: f64,
    pub service_zone_id: Uuid,
}
