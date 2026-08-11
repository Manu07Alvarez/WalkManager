use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WalkerSearchQuery {
    pub neighborhood: Option<String>,
    pub max_distance_km: Option<f64>,
    pub available_from: Option<String>,
    pub available_to: Option<String>,
    pub max_price: Option<f64>,
    pub min_rating: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WalkerSearchResult {
    pub walker_id: Uuid,
    pub distance_km: f64,
}
